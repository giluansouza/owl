import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/app/home";
import { Project } from "./pages/app/project";
import { AppLayout } from "./pages/app-layout";
import { AnalysisNetwork76 } from "./pages/app/analysis-network-76";

export function Router() {
  return (
    <Routes>
      {/* <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<Signup />} />
      </Route> */}

      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/project/celebrity-ice-bucket-challenge"
          element={<Project />}
        />
        <Route path="/project/analise-76" element={<AnalysisNetwork76 />} />
      </Route>

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
