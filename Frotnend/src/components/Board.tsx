import React, { useState, useEffect } from "react";
import { Button, Input, Modal, Form, Spin, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useBoardStore } from "../zustand/boardStore";
import { useLoginStore } from "../zustand/loginStore";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import List from "./List";
import { DropResult } from "react-beautiful-dnd";

const Board: React.FC = () => {
  const { boardId } = useParams();
  const { currentBoard, setCurrentBoard, addList, loading, error } =
    useBoardStore();
  const { logout } = useLoginStore();
  const navigate = useNavigate();
  const [isAddListModalVisible, setIsAddListModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (boardId) {
      setCurrentBoard(boardId);
    }
  }, [boardId, setCurrentBoard]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Lỗi",
        description: error,
      });
    }
  }, [error]);

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
          <Button type="text">🔍</Button>
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
              {currentBoard.lists.map((list, index) => (
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
    </div>
  );
};

export default Board;
