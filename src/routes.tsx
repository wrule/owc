import { Routes, Route } from 'react-router-dom';
import { Home } from './views/home';
import { Test } from './views/test';
import { OWC } from './views/owc';

export
function RouteView() {
  return <Routes>
    <Route path="" element={<Home />} />
    <Route path="owc" element={<OWC />} />
    <Route path="test" element={<Test />} />
  </Routes>;
}
