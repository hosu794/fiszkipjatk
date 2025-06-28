import { useState, useEffect, useCallback } from 'react';
import type { FlashcardSetSummary, FlashcardSet } from '../types';
import { FlashcardService } from '../services';

export const useFlashcardSets = (flashcardService: FlashcardService) => {
  const [availableFlashcardSets, setAvailableFlashcardSets] = useState<FlashcardSetSummary[]>([]);
  const [currentFlashcardSet, setCurrentFlashcardSet] = useState<FlashcardSet | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAvailableFlashcardSets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sets = await flashcardService.getAvailableFlashcardSets();
      setAvailableFlashcardSets(sets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setAvailableFlashcardSets([]);
    } finally {
      setLoading(false);
    }
  }, [flashcardService]);

  const loadFlashcardSet = async (setId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const flashcardSet = await flashcardService.getFlashcardSetMetadata(setId);
      setCurrentFlashcardSet(flashcardSet);
      setSelectedSetId(setId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCurrentFlashcardSet(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailableFlashcardSets();
  }, [loadAvailableFlashcardSets]);

  return {
    availableFlashcardSets,
    currentFlashcardSet,
    selectedSetId,
    loading,
    error,
    loadAvailableFlashcardSets,
    loadFlashcardSet,
    setSelectedSetId
  };
};