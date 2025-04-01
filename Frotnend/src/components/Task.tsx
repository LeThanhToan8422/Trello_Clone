import React, { useState } from "react";
import { Card, Modal, Form, Input, Button, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Task as TaskType, DEFAULT_LABELS } from "../interfaces/task.interface";
import { useBoardStore } from "../zustand/boardStore";
import "./Task.css";

interface TaskProps {
  task: TaskType;
  index: number;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  console.log(task);
  const { updateTask, deleteTask } = useBoardStore();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = (values: {
    title: string;
    description: string;
    label?: string;
  }) => {
    const selectedLabel = DEFAULT_LABELS.find((l) => l.text === values.label);
    updateTask(
      task.boardId,
      task.listId,
      task.id,
      values.title,
      values.description,
      selectedLabel
    );
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleDelete = () => {
    deleteTask(task.boardId, task.listId, task.id);
  };

  return (
    <div className="task-card">
      <Card size="small" className="task-card-content" bordered={false}>
        {task.label && (
          <div
            className="task-label"
            style={{ backgroundColor: task.label.color }}>
            {task.label.text}
          </div>
        )}
        <div className="task-body">
          <div className="task-title">{task.title}</div>
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
        </div>
        <div className="task-actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalVisible(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          />
        </div>
      </Card>

      <Modal
        title="Chỉnh sửa thẻ"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        className="task-modal">
        <Form
          form={form}
          onFinish={handleEdit}
          initialValues={{
            title: task.title,
            description: task.description,
            label: task.label?.text,
          }}
          className="task-form">
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
            <Button type="primary" htmlType="submit" block>
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Task;
