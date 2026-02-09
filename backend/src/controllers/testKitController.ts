import type { Request, Response } from 'express';
import * as testKitService from '../services/testKitService.js';

export const getTestKits = async (req: Request, res: Response) => {
  try {
    const testKits = await testKitService.getAllTestKits();
    res.json(testKits);
  } catch (error) {
    console.error('Error fetching test kits:', error);
    res.status(500).json({ error: 'Failed to fetch test kits' });
  }
};

export const getTestKit = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ error: 'Test kit id is required' });
    const testKit = await testKitService.getTestKitById(BigInt(id));
    if (!testKit) return res.status(404).json({ error: 'Test kit not found' });
    res.json(testKit);
  } catch (error) {
    console.error('Error fetching test kit:', error);
    res.status(500).json({ error: 'Failed to fetch test kit' });
  }
};
