import { Board } from "../../interfaces/task.interface";

export interface BoardState {
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
