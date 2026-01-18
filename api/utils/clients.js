/* global process */
import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini
export const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Missing GEMINI_API_KEY");
    return null;
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

// Initialize OpenAI
export const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("Missing OPENAI_API_KEY");
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};
