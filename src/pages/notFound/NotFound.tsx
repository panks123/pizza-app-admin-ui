import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store"
import { Button, Card, Layout } from "antd";
import notFound from "../../assets/notFound.webp"

const NotFound = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    if(user === null){
        return <Navigate to="/auth/login" replace/>
    }
  return (
    <Layout style={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <Card
            style={{ width: "30%" }}
            cover={
            <img
                alt="example"
                // src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                src={notFound}
            />
            }
            actions={[
                <Button type="primary" onClick={() => navigate(-1)}>
                  Go Back
                </Button>,
                <Button type="default" onClick={() => navigate("/", { replace: true })}>
                    Go to Home
                </Button>,
            ]}
        >
            <Card.Meta
                style={{textAlign: "center", fontSize: "1.5rem"}}
                title="Oops😥"
                description="Page Not Found!!!"
            />
        </Card>
    </Layout>
  )
}

export default NotFound;
