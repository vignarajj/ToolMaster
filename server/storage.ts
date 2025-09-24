// In-memory storage interface for utility tools (no database needed)
export interface IStorage {
  // Future storage operations can be added here if needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize any needed storage here
  }
}

export const storage = new MemStorage();
