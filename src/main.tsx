import React from 'react'
import ReactDOM from 'react-dom/client'
import { MainRouter } from './router';
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'antd/dist/reset.css'
import './index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{
        token: {
          colorPrimary: "#F65F42",
          colorLink: "#F65F42"
        }
      }}>
        <MainRouter/>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
