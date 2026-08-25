import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoLogOutOutline } from "react-icons/io5";
import clsx from "clsx";
import { useAuth } from "../contexts/auth/auth.context";
import { useClickOutside } from "../hooks/useClickOutside";
import { getInitials } from "../utils/avatar.utils";

const UserAvatarMenu = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  if (!user) return null;

  const initials = getInitials(user.name || user.email);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title={user.name || user.email}
        className={clsx(
          "flex items-center justify-center",
          "w-9 h-9 rounded-full",
          "bg-primary text-white font-semibold text-sm",
          "hover:scale-110 duration-75 cursor-pointer",
          "select-none",
        )}
      >
        {initials}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              "absolute right-0 top-full mt-2",
              "min-w-36 rounded-lg",
              "bg-neutral-80 border border-neutral-60",
              "shadow-xl z-50",
              "py-1",
            )}
          >
            <button
              type="button"
              onClick={handleLogout}
              className={clsx(
                "flex items-center gap-2 w-full px-3 py-2",
                "text-sm text-text-primary",
                "hover:bg-neutral-60 cursor-pointer",
                "transition-colors duration-100",
              )}
            >
              <IoLogOutOutline size={18} />
              <span>Sair</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatarMenu;
