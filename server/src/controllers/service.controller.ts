import { Request, Response } from "express";
import mongoose from "mongoose";
import Service, { IService } from "../models/Service.js";

interface ServiceBody {
  name: string;
  description: string;
  price: number;
  turnaround: string;
  isActive?: boolean;
}

interface UpdateServiceBody {
  name?: string;
  description?: string;
  price?: number;
  turnaround?: string;
  isActive?: boolean;
}

interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  turnaround: string;
  isActive: boolean;
}

const toServiceResponse = (service: IService): ServiceResponse => ({
  id: String(service._id),
  name: service.name,
  description: service.description,
  price: service.price,
  turnaround: service.turnaround,
  isActive: service.isActive,
});

const isValidId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

export const getAllServices = async (_: Request, res: Response) => {
  try {
    const services = await Service.find({ isActive: true });
    res.status(200).json({ services: services.map(toServiceResponse) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getServiceById = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ message: "Invalid service ID" });
    return;
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }
    res.status(200).json({ service: toServiceResponse(service) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createService = async (
  req: Request<{}, {}, ServiceBody>,
  res: Response
) => {
  try {
    const { name, description, price, turnaround, isActive } = req.body;

    if (!name || !description || !turnaround) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (price === undefined || price < 0) {
      res.status(400).json({ message: "Price must be a positive number" });
      return;
    }

    const service = await Service.create({ name, description, price, turnaround, isActive });
    res.status(201).json({ service: toServiceResponse(service) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateService = async (
  req: Request<{ id: string }, {}, UpdateServiceBody>,
  res: Response
) => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ message: "Invalid service ID" });
    return;
  }

  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({ service: toServiceResponse(service) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteService = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  if (!isValidId(req.params.id)) {
    res.status(400).json({ message: "Invalid service ID" });
    return;
  }

  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      res.status(404).json({ message: "Service not found" });
      return;
    }

    res.status(200).json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
