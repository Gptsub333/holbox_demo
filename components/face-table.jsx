"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/ui/confirmationModal";

// Debounce utility
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function UsersTable({ refreshToken }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    user: null,
  });

  // Fetch users
  const fetchUsers = useCallback(
    async (query = "") => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BACKEND_URL}/users?search=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setUsers(data);
        console.log("Fetched users:", data);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setUsers([]);
      }
      setLoading(false);
    },
    []
  );

  // Debounced fetch
  const debouncedFetch = useCallback(debounce(fetchUsers, 300), [fetchUsers]);

  // 🔍 search changes → debounced fetch
  useEffect(() => {
    debouncedFetch(search);
  }, [search, debouncedFetch]);

  // 🔁 parent-triggered refresh (no debounce → instant)
  useEffect(() => {
    if (refreshToken !== undefined) {
      fetchUsers(search);
    }
  }, [refreshToken, fetchUsers, search]);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  // 🔔 open modal with selected user
  function handleDeleteClick(user) {
    setDeleteModal({
      isOpen: true,
      user,
    });
  }

  // ✅ called when user confirms in modal
  async function confirmDelete() {
    if (!deleteModal.user) return;
    const faceId = deleteModal.user.face_id;

    try {
      await fetch(`${BACKEND_URL}/users/${faceId}`, {
        method: "DELETE",
      });

      // Optimistic update
      setUsers((users) => users.filter((u) => u.face_id !== faceId));

      // Optionally re-sync from backend if needed
      // await fetchUsers(search);
    } catch (e) {
      console.error("Failed to delete user", e);
    } finally {
      setDeleteModal({ isOpen: false, user: null });
    }
  }

  const tableVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="bg-white rounded-md p-6 shadow mt-8"
      initial="hidden"
      animate="visible"
      variants={tableVariants}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearch}
          className="w-full sm:w-1/2 border rounded px-3 py-2"
          autoFocus
        />

        {/* 🔄 manual refresh button */}
        <button
          type="button"
          onClick={() => fetchUsers(search)}
          disabled={loading}
          className="px-4 py-2 rounded-md border text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Loading...
        </motion.div>
      )}

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 border-b">Image</th>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Face ID</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
          </thead>
          <AnimatePresence>
            <tbody>
              {users.length === 0 && !loading && (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={4} className="text-center py-4">
                    No users found.
                  </td>
                </motion.tr>
              )}
              {users.map((user) => (
                <motion.tr
                  key={user.face_id}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={rowVariants}
                  layout
                >
                  <td className="px-4 py-2 border-b text-center">
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt="User"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.face_id}</td>
                  <td className="px-4 py-2 border-b text-center">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "#ef4444",
                        color: "#fff",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteClick(user)}
                      className="border border-red-400 rounded px-3 py-1 text-red-500 transition"
                    >
                      Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="block md:hidden">
        <AnimatePresence>
          {users.length === 0 && !loading && (
            <motion.div
              key="empty-mobile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              No users found.
            </motion.div>
          )}

          {users.map((user) => (
            <motion.div
              key={user.face_id}
              className="border border-gray-200 rounded p-4 mb-4 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center space-x-4">
                {user.image_url ? (
                  <img
                    src={user.image_url}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    No image
                  </div>
                )}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    Face ID: {user.face_id}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-right">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDeleteClick(user)}
                  className="border border-red-400 rounded px-3 py-1 text-red-500 hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 🔔 Confirmation modal (this is what was missing) */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Face Record?"
        description={
          deleteModal.user
            ? `Are you sure you want to delete "${deleteModal.user.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this record?"
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
      />
    </motion.div>
  );
}
