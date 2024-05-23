const InputError = require("../exceptions/InputError.js");
const predictBinary = require("../services/inferenceService.js");
const storeData = require("../services/storeData.js");
const { Firestore } = require("@google-cloud/firestore");
const crypto = require("crypto");

const firestore = new Firestore();

const predikHandler = async (request, h) => {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;

    // Predict using the model
    const { confidenceScore, label, suggestion } = await predictBinary(
      model,
      image
    );

    // Generate an ID for the prediction
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Prepare data for storage
    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    // Store the prediction data
    await storeData(id, data);

    // Return success response
    return h
      .response({
        status: "success",
        message: "Model is predicted successfully",
        data,
      })
      .code(201);
  } catch (error) {
    // Log error and return failure response
    console.error("Error predicting:", error);
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
};

const RiwayatHandler = async () => {
  try {
    // Retrieve prediction histories from Firestore
    const snapshot = await firestore.collection("predictions").get();

    if (snapshot.empty) {
      // No histories found
      return {
        status: "success",
        data: [],
      };
    } else {
      // Map retrieved documents to history objects
      const histories = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          result: data.result,
          createdAt: data.createdAt,
          suggestion: data.suggestion,
        };
      });

      // Return success response with histories
      return {
        status: "success",
        data: histories,
      };
    }
  } catch (error) {
    // Log error and return error response
    console.error("Error retrieving histories:", error);
    return {
      status: "error",
      message: "Failed to retrieve histories",
      error: error.message,
    };
  }
};

const notfoundHandler = (h) =>
  h
    .response({
      status: "fail",
      message: "Halaman tidak ditemukan",
    })
    .code(404);

module.exports = {
  predikHandler,
  RiwayatHandler,
  notfoundHandler,
};
