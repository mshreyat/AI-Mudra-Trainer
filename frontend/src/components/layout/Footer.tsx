export const Footer = () => {
  return (
    <footer className="border-t border-surface-800/50 py-8 bg-surface-950">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-surface-400">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="font-display font-semibold text-surface-200">MudraSense AI</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
