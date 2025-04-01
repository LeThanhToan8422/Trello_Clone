import { create, get, StateCreator } from "zustand";
import axiosInstance from "../config/axios";
import { Board, List } from "../interfaces/task.interface";

interface BoardState {
  boards: Board[];
  currentBoard: Board | null;
  loading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  fetchBoardById: (id: string) => Promise<void>;
  addBoard: (
    title: string,
    description?: string,
    background?: string
  ) => Promise<void>;
  updateBoard: (
    boardId: string,
    title: string,
    description?: string,
    background?: string
  ) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  setCurrentBoard: (boardId: string) => Promise<void>;
  addList: (boardId: string, title: string) => Promise<void>;
  updateList: (boardId: string, listId: string, title: string) => Promise<void>;
  deleteList: (boardId: string, listId: string) => Promise<void>;
  addTask: (
    boardId: string,
    listId: string,
    title: string,
    description: string,
    label?: { text: string; color: string }
  ) => Promise<void>;
  updateTask: (
    boardId: string,
    listId: string,
    taskId: string,
    title: string,
    description?: string,
    label?: { text: string; color: string }
  ) => Promise<void>;
  deleteTask: (
    boardId: string,
    listId: string,
    taskId: string
  ) => Promise<void>;
  searchBoards: (searchTerm: string) => Promise<void>;
}

const createBoardStore: StateCreator<BoardState> = (set, get) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  fetchBoards: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/boards/user/id`);
      set({ boards: response.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch boards";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchBoardById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/boards/${id}`);
      set({ currentBoard: response.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch board";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  addBoard: async (
    title: string,
    description?: string,
    background?: string
  ) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post(`/boards`, {
        title,
        description,
        background,
      });
      set((state) => ({ boards: [...state.boards, response.data] }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create board";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateBoard: async (
    boardId: string,
    title: string,
    description?: string,
    background?: string
  ) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.patch(`/boards/${boardId}`, {
        title,
        description,
        background,
      });
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? response.data : board
        ),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update board";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteBoard: async (boardId: string) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/boards/${boardId}`);
      set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
      }));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete board";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  setCurrentBoard: async (boardId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: response.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to set current board";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  addList: async (boardId: string, title: string) => {
    try {
      set({ loading: true, error: null });
      const currentBoard = get().currentBoard;
      if (!currentBoard) return;

      const order = currentBoard.lists.length;
      await axiosInstance.post(`/lists`, {
        title,
        boardId,
        order,
      });
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add list";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateList: async (boardId: string, listId: string, title: string) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.patch(`/lists/${listId}`, {
        title,
      });
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update list";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteList: async (boardId: string, listId: string) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/lists/${listId}`);
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete list";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  addTask: async (
    boardId: string,
    listId: string,
    title: string,
    description: string,
    label?: { text: string; color: string }
  ) => {
    try {
      set({ loading: true, error: null });
      const currentBoard = get().currentBoard;
      if (!currentBoard) return;

      const list = currentBoard.lists.find((l: List) => l.id === listId);
      if (!list) return;

      const order = list.tasks.length;
      await axiosInstance.post(`/tasks`, {
        title,
        description,
        listId,
        boardId,
        label,
        order,
      });
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add task";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateTask: async (
    boardId: string,
    listId: string,
    taskId: string,
    title: string,
    description?: string,
    label?: { text: string; color: string }
  ) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.patch(`/tasks/${taskId}`, {
        title,
        description,
        listId,
        label,
      });
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (boardId: string, listId: string, taskId: string) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/tasks/${taskId}`);
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete task";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  moveTask: async (
    boardId: string,
    taskId: string,
    sourceListId: string,
    destinationListId: string,
    newOrder: number
  ) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.patch(`/tasks/${taskId}/move`, {
        sourceListId,
        destinationListId,
        newOrder,
      });
      const updatedBoard = await axiosInstance.get(`/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to move task";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  searchBoards: async (searchTerm: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(
        `/boards/search/title?q=${searchTerm}`
      );
      set({ currentBoard: response.data[0] || null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to search boards";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },
});

export const useBoardStore = create<BoardState>(createBoardStore);
