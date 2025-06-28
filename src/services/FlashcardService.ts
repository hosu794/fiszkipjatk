import type { FlashcardSet, FlashcardSetSummary, Question } from '../types';
import type { IFlashcardRepository } from './FlashcardRepository';
import { DEFAULT_QUESTIONS } from '../constants/defaultQuestions';

export class FlashcardService {
  private repository: IFlashcardRepository;
  
  constructor(repository: IFlashcardRepository) {
    this.repository = repository;
  }

  async getAvailableFlashcardSets(): Promise<FlashcardSetSummary[]> {
    return await this.repository.getAvailableFlashcardSets();
  }

  async loadFlashcardSet(setId: string): Promise<Question[]> {
    try {
      const flashcardSet = await this.repository.getFlashcardSet(setId);
      return flashcardSet.questions;
    } catch (error) {
      console.warn(`Failed to load flashcard set ${setId}, falling back to default questions:`, error);
      return DEFAULT_QUESTIONS;
    }
  }

  async getFlashcardSetMetadata(setId: string): Promise<FlashcardSet> {
    return await this.repository.getFlashcardSet(setId);
  }
}