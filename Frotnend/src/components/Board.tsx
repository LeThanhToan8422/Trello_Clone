import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Modal, Form, Spin, Select } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useBoardStore } from "../zustand/boardStore";
import { useLoginStore } from "../zustand/loginStore";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import List from "./List";
import { DropResult } from "react-beautiful-dnd";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Task,
  List as ListType,
  DEFAULT_LABELS,
} from "../interfaces/task.interface";

const Board: React.FC = () => {
  const { boardId } = useParams();
  const { currentBoard, setCurrentBoard, addList, loading, error, boards } =
    useBoardStore();

  const { logout } = useLoginStore();
  const navigate = useNavigate();
  const [isAddListModalVisible, setIsAddListModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [searchResults, setSearchResults] = useState<
    Array<{
      boardId: string;
      boardTitle: string;
      task: Task;
    }>
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();
  const [filteredLists, setFilteredLists] = useState<ListType[]>([]);

  useEffect(() => {
    if (boardId) {
      setCurrentBoard(boardId);
    }
  }, [boardId, setCurrentBoard]);

  useEffect(() => {
    if (error) {
      toast.error(`🦄 ${error}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [error]);

  useEffect(() => {
    if (currentBoard) {
      setFilteredLists(currentBoard.lists);
    }
  }, [currentBoard]);

  useEffect(() => {
    // Handle click outside search results
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const results: Array<{
        boardId: string;
        boardTitle: string;
        task: Task;
      }> = [];
      boards?.forEach((board) => {
        board.lists?.forEach((list) => {
          list.tasks
            .filter((task) =>
              task.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .forEach((task) => {
              results.push({
                boardId: board.id,
                boardTitle: board.title,
                task,
              });
            });
        });
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [JSON.stringify(searchTerm), JSON.stringify(boards)]);

  const handleAddList = async (values: { title: string }) => {
    if (boardId) {
      await addList(boardId, values.title);
      setIsAddListModalVisible(false);
      form.resetFields();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !currentBoard) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const list = currentBoard.lists.find((l) => l.id === source.droppableId);
      if (!list) return;

      const newTasks = Array.from(list.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      // Update task orders
      newTasks.forEach((task, index) => {
        task.order = index;
      });

      // Update the list with new task order
      const updatedLists = currentBoard.lists.map((l) =>
        l.id === source.droppableId ? { ...l, tasks: newTasks } : l
      );
      const updatedBoard = { ...currentBoard, lists: updatedLists };
      useBoardStore.setState({ currentBoard: updatedBoard });
    } else {
      // Moving between lists
      const sourceList = currentBoard.lists.find(
        (l) => l.id === source.droppableId
      );
      const destList = currentBoard.lists.find(
        (l) => l.id === destination.droppableId
      );
      if (!sourceList || !destList) return;

      const sourceTasks = Array.from(sourceList.tasks);
      const destTasks = Array.from(destList.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, removed);

      // Update task orders in both lists
      sourceTasks.forEach((task, index) => {
        task.order = index;
      });
      destTasks.forEach((task, index) => {
        task.order = index;
      });

      // Update both lists
      const updatedLists = currentBoard.lists.map((l) => {
        if (l.id === source.droppableId) {
          return { ...l, tasks: sourceTasks };
        }
        if (l.id === destination.droppableId) {
          return { ...l, tasks: destTasks };
        }
        return l;
      });
      const updatedBoard = { ...currentBoard, lists: updatedLists };
      useBoardStore.setState({ currentBoard: updatedBoard });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTaskClick = async (boardId: string, task: Task) => {
    setShowSearchResults(false);
    setSearchTerm("");
    setSelectedTask(task);
    await setCurrentBoard(boardId);
    navigate(`/board/${boardId}`);
    setIsTaskModalVisible(true);
  };

  if (loading) {
    return (
      <div className="board-loading">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (!currentBoard) {
    return <div>Không tìm thấy bảng</div>;
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <div className="header-left">
          <h2>{currentBoard.title}</h2>
          <Button type="text">⭐</Button>
          <Button type="text">🔄</Button>
          <Button type="primary">📋 Bảng</Button>
        </div>
        <div className="header-right">
          <div className="search-container" ref={searchRef}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
            {showSearchResults && searchTerm.trim() && (
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <div
                      key={result.task.id}
                      className="search-result-item"
                      onClick={() =>
                        handleTaskClick(result.boardId, result.task)
                      }>
                      <div className="task-title">{result.task.title}</div>
                      <div className="board-title">
                        trong bảng: {result.boardTitle}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    Không tìm thấy kết quả phù hợp
                  </div>
                )}
              </div>
            )}
          </div>
          <Button type="text">⚡</Button>
          <Button type="text">⚙️</Button>
          <Button type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="LIST">
          {(provided) => (
            <div
              className="lists-container"
              ref={provided.innerRef}
              {...provided.droppableProps}>
              {filteredLists.map((list, index) => (
                <List key={list.id} list={list} index={index} />
              ))}
              {provided.placeholder}
              <div className="add-list-button">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setIsAddListModalVisible(true)}>
                  Thêm danh sách khác
                </Button>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Modal
        title="Thêm danh sách mới"
        open={isAddListModalVisible}
        onCancel={() => setIsAddListModalVisible(false)}
        footer={null}>
        <Form form={form} onFinish={handleAddList}>
          <Form.Item
            name="title"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh sách" },
            ]}>
            <Input placeholder="Nhập tên danh sách" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết thẻ"
        open={isTaskModalVisible}
        onCancel={() => setIsTaskModalVisible(false)}
        footer={null}>
        {selectedTask && (
          <Form
            initialValues={{
              title: selectedTask.title,
              description: selectedTask.description,
              label: selectedTask.label?.text,
            }}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
              <Input placeholder="Nhập tiêu đề thẻ" />
            </Form.Item>
            <Form.Item name="description">
              <Input.TextArea placeholder="Nhập mô tả" />
            </Form.Item>
            <Form.Item name="label" label="Nhãn">
              <Select
                placeholder="Chọn nhãn"
                allowClear
                style={{ width: "100%" }}
                options={DEFAULT_LABELS.map((label) => ({
                  value: label.text,
                  label: (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 4,
                          backgroundColor: label.color,
                        }}
                      />
                      <span>{label.text}</span>
                    </div>
                  ),
                }))}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Board;
