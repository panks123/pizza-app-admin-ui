import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ConfigProvider } from "antd";
import { router } from './router';
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

        <RouterProvider router={router}/>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
