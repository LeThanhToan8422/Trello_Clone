import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { FacebookFilled, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { loginRI } from "../interfaces/login.interface";
import { useLoginStore } from "../zustand/loginStore";
import { Bounce, toast } from "react-toastify";
import "../styles/Login.css";

const { Title } = Typography;

const Login: React.FC = () => {
  const { loginUser } = useLoginStore();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await loginUser(values);
      toast.success("🦄 Chào mừng bạn quay trở lại!", {
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
      navigate("/boards");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đăng nhập thất bại";
      toast.error(`🦄 ${errorMessage}`, {
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
  };

  const onValuesChange = (changedValues: Partial<loginRI>) => {
    useLoginStore.setState((state) => ({
      userR: { ...state.userR, ...changedValues },
    }));
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">
          Đăng nhập
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          layout="vertical"
          className="login-form">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}>
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
            <Input.Password placeholder="Nhập mật khẩu của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="divider-text">hoặc</div>

        <div className="social-buttons">
          <Button
            className="social-button"
            icon={<FacebookFilled style={{ color: "#1877f2" }} />}
          />
          <Button
            className="social-button"
            icon={<GoogleOutlined style={{ color: "#db4437" }} />}
          />
        </div>

        <div className="footer-text">
          Chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
