import React, { useState } from "react";
import { Button, Input, Modal, Form, Typography, Tag, Select } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useBoardStore } from "../zustand/boardStore";
import Task from "./Task";
import { List as ListType, DEFAULT_LABELS } from "../interfaces/task.interface";
import "./List.css";

const { Text } = Typography;

interface ListProps {
  list: ListType;
  index: number;
}

const List: React.FC<ListProps> = ({ list }) => {
  const { addTask, deleteList, updateList } = useBoardStore();
  const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [form] = Form.useForm();

  const handleAddTask = async (values: {
    title: string;
    description: string;
    label?: string;
  }) => {
    const selectedLabel = DEFAULT_LABELS.find((l) => l.text === values.label);
    addTask(
      list.boardId,
      list.id,
      values.title,
      values.description,
      selectedLabel
    );
    setIsAddTaskModalVisible(false);
    form.resetFields();
  };

  const handleDeleteList = () => {
    deleteList(list.boardId, list.id);
  };

  const handleUpdateTitle = (newTitle: string) => {
    updateList(list.boardId, list.id, newTitle);
    setIsEditingTitle(false);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case "ToDo":
        return <Tag color="blue">ToDo</Tag>;
      case "Done":
        return <Tag color="green">Done</Tag>;
      case "Doing":
        return <Tag color="gold">Doing</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="list-container">
      <div className="list-header">
        {isEditingTitle ? (
          <Input
            autoFocus
            defaultValue={list.title}
            onBlur={(e) => handleUpdateTitle(e.target.value)}
            onPressEnter={(e) => handleUpdateTitle(e.currentTarget.value)}
          />
        ) : (
          <div className="list-title" onClick={() => setIsEditingTitle(true)}>
            <Text strong>{list.title}</Text>
            {getStatusTag(list.title)}
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              className="edit-button"
            />
          </div>
        )}
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={handleDeleteList}
        />
      </div>

      <div className="list-footer">
        <Button
          type="text"
          block
          icon={<PlusOutlined />}
          onClick={() => setIsAddTaskModalVisible(true)}>
          Thêm thẻ
        </Button>
      </div>

      <div className="task-list">
        {list.tasks.map((task, index) => (
          <Task key={task.id} task={task} index={index} />
        ))}
      </div>

      <Modal
        title="Thêm thẻ mới"
        open={isAddTaskModalVisible}
        onCancel={() => setIsAddTaskModalVisible(false)}
        footer={null}>
        <Form form={form} onFinish={handleAddTask}>
          <Form.Item
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input placeholder="Nhập tiêu đề thẻ" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea placeholder="Nhập mô tả (tùy chọn)" />
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
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default List;
