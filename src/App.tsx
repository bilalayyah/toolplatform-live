import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Layout} from './components/Layout';
import {CATEGORIES, TOOLS} from './data/tools';
import {ThemeProvider} from './lib/theme';
import {AboutPage} from './pages/AboutPage';
import {AllToolsPage} from './pages/AllToolsPage';
import {BlogPage} from './pages/BlogPage';
import {CategoryPage} from './pages/CategoryPage';
import {ContactPage} from './pages/ContactPage';
import {FaqPage} from './pages/FaqPage';
import {HomePage} from './pages/HomePage';
import {CookiePolicyPage, PrivacyPage, TermsPage} from './pages/LegalPages';
import {NotFoundPage} from './pages/NotFoundPage';
import {ToolPage} from './pages/ToolPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<AllToolsPage />} />

            {/* Registry-generated Category Routes */}
            {CATEGORIES.map((category) => (
              <Route
                key={category.id}
                path={category.url}
                element={<CategoryPage categoryId={category.id} />}
              />
            ))}

            {/* Registry-generated Tool Routes */}
            {TOOLS.map((tool) => (
              <Route
                key={tool.id}
                path={tool.url}
                element={<ToolPage slug={tool.slug} />}
              />
            ))}

            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/blog" element={<BlogPage />} />

            {/* Custom 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
