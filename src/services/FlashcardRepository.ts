import type { FlashcardSet, FlashcardIndex, FlashcardSetSummary } from '../types';

export interface IFlashcardRepository {
  getAvailableFlashcardSets(): Promise<FlashcardSetSummary[]>;
  getFlashcardSet(setId: string): Promise<FlashcardSet>;
}

export class FlashcardRepository implements IFlashcardRepository {
  private readonly BASE_URL = '/flashcards';

  async getAvailableFlashcardSets(): Promise<FlashcardSetSummary[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/index.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: FlashcardIndex = await response.json();
      return data.availableFlashcardSets;
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
      throw new Error('Nie udało się wczytać dostępnych zestawów fiszek');
    }
  }

  async getFlashcardSet(setId: string): Promise<FlashcardSet> {
    try {
      const response = await fetch(`${this.BASE_URL}/${setId}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const flashcardSet: FlashcardSet = await response.json();
      this.validateFlashcardSet(flashcardSet);
      
      return flashcardSet;
    } catch (error) {
      console.error(`Error loading flashcard set ${setId}:`, error);
      throw new Error(`Nie udało się wczytać zestawu fiszek: ${setId}`);
    }
  }

  private validateFlashcardSet(flashcardSet: FlashcardSet): void {
    if (!flashcardSet.metadata || !flashcardSet.questions) {
      throw new Error('Invalid flashcard set structure');
    }

    if (!Array.isArray(flashcardSet.questions) || flashcardSet.questions.length === 0) {
      throw new Error('Flashcard set must contain questions');
    }

    for (const question of flashcardSet.questions) {
      if (!question.id || !question.question || !question.options || !question.correctAnswer) {
        throw new Error('Invalid question structure');
      }

      if (!['A', 'B', 'C', 'D'].includes(question.correctAnswer)) {
        throw new Error('Invalid correct answer');
      }
    }
  }
}