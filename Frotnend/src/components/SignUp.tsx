import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { FacebookFilled, GoogleOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { userRI } from "../interfaces/user.interface";
import { useSignUpStore } from "../zustand/signUpStore";
import { Bounce, toast } from "react-toastify";

const { Title } = Typography;

const SignUp = () => {
  const { signUpUser } = useSignUpStore();
  const [form] = Form.useForm<userRI>();
  const navigate = useNavigate();

  const onFinish = async (values: userRI) => {
    try {
      await signUpUser(values);
      toast.success("🦄 Đăng ký thành công! Vui lòng đăng nhập.", {
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
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? "Email nãy đã được đăng ký."
          : "Đăng ký thất bại. Vui lòng thử lại.";
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

  const onValuesChange = (changedValues: Partial<userRI>) => {
    useSignUpStore.setState((state) => ({
      userR: { ...state.userR, ...changedValues },
    }));
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">
          Đăng ký
        </Title>
        <Form
          name="signup"
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          layout="vertical"
          className="login-form">
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}>
            <Input placeholder="Nhập họ và tên của bạn" />
          </Form.Item>

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
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}>
            <Input.Password placeholder="Nhập mật khẩu của bạn" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              Đăng ký
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
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;
