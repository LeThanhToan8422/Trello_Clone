import { create } from "zustand";
import axios from "axios";
import { Board } from "../interfaces/task.interface";
import { API_URL, TOKEN_KEY } from "../assets/constants/constant";

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

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,

  fetchBoards: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${API_URL}/boards/user/id`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
      });
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
      const response = await axios.get(`${API_URL}/boards/${id}`);
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
      const response = await axios.post(
        `${API_URL}/boards`,
        {
          title,
          description,
          background,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
      );
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
      const response = await axios.patch(`${API_URL}/boards/${boardId}`, {
        title,
        description,
        background,
      });
      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? response.data : board
        ),
        currentBoard:
          state.currentBoard?.id === boardId
            ? response.data
            : state.currentBoard,
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
      await axios.delete(`${API_URL}/boards/${boardId}`);
      set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
        currentBoard:
          state.currentBoard?.id === boardId ? null : state.currentBoard,
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
    await get().fetchBoardById(boardId);
  },

  addList: async (boardId: string, title: string) => {
    try {
      set({ loading: true, error: null });
      const currentBoard = get().currentBoard;
      if (!currentBoard) return;

      await axios.post(`${API_URL}/lists`, {
        title,
        boardId,
        order: currentBoard.lists.length,
      });

      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create list";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateList: async (boardId: string, listId: string, title: string) => {
    try {
      set({ loading: true, error: null });
      await axios.patch(`${API_URL}/lists/${listId}`, {
        title,
        boardId,
      });

      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
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
      await axios.delete(`${API_URL}/lists/${listId}`);

      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
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

      const list = currentBoard.lists.find((l) => l.id === listId);
      if (!list) return;

      await axios.post(`${API_URL}/tasks`, {
        title,
        description,
        listId,
        boardId,
        order: list.tasks.length,
        label,
      });

      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create task";
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
      set({ loading: true });
      await axios.patch(`${API_URL}/tasks/${taskId}`, {
        title,
        description,
        label,
      });
      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update task",
      });
    } finally {
      set({ loading: false });
    }
  },

  deleteTask: async (boardId: string, listId: string, taskId: string) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/tasks/${taskId}`);

      const updatedBoard = await axios.get(`${API_URL}/boards/${boardId}`);
      set({ currentBoard: updatedBoard.data });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete task";
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  searchBoards: async (searchTerm: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(
        `${API_URL}/boards/search/title?q=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
          },
        }
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
}));
