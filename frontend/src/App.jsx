import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Detection from "./pages/Detection";
import Heatmap from "./pages/Heatmap";
import Events from "./pages/Events";
import AI from "./pages/AI";
import Branches from "./pages/Branches";
import Settings from "./pages/Settings";
import Validation from "./pages/Validation";

export default function App(){

    return(

        <BrowserRouter>

            <Routes>

                <Route
                    path="/validation"
                    element={<Validation/>}
                />

                <Route
                    path="*"
                    element={
                        <MainLayout>

                            <Routes>

                                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

                                <Route path="/dashboard" element={<Dashboard/>}/>

                                <Route path="/detection" element={<Detection/>}/>

                                <Route path="/heatmap" element={<Heatmap/>}/>

                                <Route path="/events" element={<Events/>}/>

                                <Route path="/ai" element={<AI/>}/>

                                <Route path="/branches" element={<Branches/>}/>

                                <Route path="/settings" element={<Settings/>}/>

                            </Routes>

                        </MainLayout>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}
