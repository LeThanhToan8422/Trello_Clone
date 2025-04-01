import React, { useState, useEffect } from "react";
import { Card, Button, Input, Modal, Form, Typography, Spin, Menu } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  AppstoreOutlined,
  EyeOutlined,
  TeamOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useBoardStore } from "../zustand/boardStore";
import { useNavigate } from "react-router-dom";
import "./BoardList.css";
import { useLoginStore } from "../zustand/loginStore";
import { Bounce, toast } from "react-toastify";

const { Title, Text } = Typography;

const BoardList: React.FC = () => {
  const {
    boards,
    addBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    fetchBoards,
    loading,
    error,
  } = useBoardStore();
  const navigate = useNavigate();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingBoard, setEditingBoard] = useState<{
    id: string;
    title: string;
    description?: string;
  } | null>(null);
  const [form] = Form.useForm();
  const { logout } = useLoginStore();
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

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

  const handleAddBoard = async (values: {
    title: string;
    description?: string;
  }) => {
    await addBoard(values.title, values.description);
    setIsAddModalVisible(false);
    form.resetFields();
  };

  const handleUpdateBoard = async (values: {
    title: string;
    description?: string;
  }) => {
    if (editingBoard) {
      await updateBoard(editingBoard.id, values.title, values.description);
      setEditingBoard(null);
    }
    form.resetFields();
  };

  const handleDeleteBoard = async (boardId: string) => {
    await deleteBoard(boardId);
  };

  const handleBoardClick = async (boardId: string) => {
    await setCurrentBoard(boardId);
    navigate(`/board/${boardId}`);
  };

  if (loading) {
    return (
      <div className="board-list-loading">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="top-nav">
        <div className="nav-left">
          <div className="app-logo">T</div>
          <div className="app-name">Trello</div>
        </div>
        <Menu mode="horizontal" className="nav-menu" selectedKeys={["board"]}>
          <Menu.Item key="board" icon={<AppstoreOutlined />}>
            Bảng
          </Menu.Item>
          <Menu.Item key="viewing" icon={<EyeOutlined />}>
            Đang xem
          </Menu.Item>
          <Menu.Item key="members" icon={<TeamOutlined />}>
            Thành viên (1)
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />}>
            Cài đặt
          </Menu.Item>
        </Menu>
        <Button
          type="primary"
          className="upgrade-button"
          style={{ background: "red" }}
          onClick={logout}>
          Đăng xuất
        </Button>
      </div>

      <div className="board-list-container">
        <div className="board-section">
          <div className="board-list-header">
            <div className="header-content">
              <Title level={3}>Bảng của bạn</Title>
            </div>
          </div>

          <div className="boards-wrapper">
            <Card
              className="create-board-card"
              onClick={() => setIsAddModalVisible(true)}>
              <div className="create-board-content">
                <PlusOutlined className="plus-icon" />
                <Text>Tạo bảng mới</Text>
              </div>
            </Card>

            {boards.map((board) => (
              <Card
                key={board.id}
                hoverable
                className="board-card"
                onClick={() => handleBoardClick(board.id)}
                cover={
                  <div
                    className="board-card-cover"
                    style={{
                      backgroundColor: board.background || "#1890ff",
                    }}>
                    <div className="board-card-overlay" />
                    <Text className="board-card-title">{board.title}</Text>
                  </div>
                }>
                <div className="board-card-actions">
                  <Button
                    type="text"
                    icon={<StarOutlined />}
                    className="board-action-button"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    className="board-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBoard(board);
                    }}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="board-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.id);
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title="Tạo bảng mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        className="board-modal">
        <Form form={form} onFinish={handleAddBoard} className="board-form">
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên bảng" }]}>
            <Input placeholder="Nhập tên bảng" className="board-input" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              placeholder="Nhập mô tả (tùy chọn)"
              className="board-input"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="board-submit-button">
              Tạo bảng
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa bảng"
        open={!!editingBoard}
        onCancel={() => setEditingBoard(null)}
        footer={null}
        className="board-modal">
        <Form
          form={form}
          onFinish={handleUpdateBoard}
          initialValues={editingBoard || {}}
          className="board-form">
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tên bảng" }]}>
            <Input placeholder="Nhập tên bảng" className="board-input" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              placeholder="Nhập mô tả (tùy chọn)"
              className="board-input"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="board-submit-button">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BoardList;
