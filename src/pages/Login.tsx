import { Button, Row } from "antd";
import { FieldValues} from "react-hook-form";
import { useLoginMutation } from "../redux/features/auth/authApi";
import { setUser, TUser } from "../redux/features/auth/authSlice";
import { useAppDispatch } from "../redux/features/hook";
import { verifyToken } from "../utils/verifyToken";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PHInput from "../components/form/PHInput";
import PHForm from "../components/form/PHForm";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { register, handleSubmit } = useForm({
  //   defaultValues: {
  //     userId: "A-0001",
  //     password: "admin123",
  //   },
  // });

  const defaultValues = {
    userId: "A-0001",
    password: "admin123",
  };

  const [login] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    const toastID = toast("Loging IN....");
    try {
      const userInfo = {
        id: data.userId,
        password: data.password,
      };
      const res = await login(userInfo).unwrap();
      console.log(res);
      const user = verifyToken(res.data.accessToken) as TUser;
      dispatch(setUser({ user: { user }, token: res.data.accessToken }));
      navigate(`/${user?.role}/dashboard`);
      toast.success("login Successfully", { id: toastID });
    } catch (err) {
      toast.error("SomeTing Went Worron", { id: toastID });
      console.log(err)
    }
  };

  return (
    // <form onSubmit={handleSubmit(onSubmit)}>
    //   <div>
    //     <label htmlFor="id">ID: </label>
    //     <input type="text" id="id" {...register("userId")} />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password: </label>
    //     <input type="text" id="password" {...register("password")} />
    //   </div>
    //   <Button htmlType="submit">Login</Button>
    // </form>
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <PHForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <PHInput type="text" name="userId" label="ID:" />
        <PHInput type="text" name="password" label="Password" />
        <Button htmlType="submit">Login</Button>
      </PHForm>
    </Row>
  );
};

export default Login;
