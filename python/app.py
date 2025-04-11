import tkinter as tk
from tkinter import ttk, messagebox
import requests
from datetime import datetime

API_URL = "https://microscope-0jah.onrender.com"

class MicroscopeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Microscope Conversion")
        self.root.geometry("700x500")

        self.build_ui()
        self.fetch_data()

    def build_ui(self):
        # ===== Form Fields =====
        frame = ttk.Frame(self.root, padding=20)
        frame.pack()

        ttk.Label(frame, text="Username").grid(row=0, column=0, sticky="w")
        self.username_entry = ttk.Entry(frame, width=30)
        self.username_entry.grid(row=0, column=1)

        ttk.Label(frame, text="Microscope Size").grid(row=1, column=0, sticky="w")
        self.microscope_size_entry = ttk.Entry(frame, width=30)
        self.microscope_size_entry.grid(row=1, column=1)

        ttk.Label(frame, text="Magnification Coefficient").grid(row=2, column=0, sticky="w")
        self.magnification_entry = ttk.Entry(frame, width=30)
        self.magnification_entry.grid(row=2, column=1)

        ttk.Label(frame, text="Original Size (calculated)").grid(row=3, column=0, sticky="w")
        self.original_size_var = tk.StringVar()
        self.original_size_entry = ttk.Entry(frame, textvariable=self.original_size_var, width=30, state='readonly')
        self.original_size_entry.grid(row=3, column=1)

        submit_btn = ttk.Button(frame, text="Calculate & Submit", command=self.submit_data)
        submit_btn.grid(row=4, column=0, columnspan=2, pady=10)

        # ===== Table =====
        self.tree = ttk.Treeview(
            self.root,
            columns=("Username", "Microscope", "Magnification", "Original", "Date"),
            show="headings"
        )
        self.tree.heading("Username", text="Username")
        self.tree.heading("Microscope", text="Microscope Size")
        self.tree.heading("Magnification", text="Magnification")
        self.tree.heading("Original", text="Original Size")
        self.tree.heading("Date", text="Date Submitted")

        self.tree.pack(expand=True, fill='both', padx=20, pady=10)

    def submit_data(self):
        try:
            username = self.username_entry.get()
            microscope_size = float(self.microscope_size_entry.get())
            magnification = float(self.magnification_entry.get())
            original_size = microscope_size / magnification
            self.original_size_var.set(f"{original_size:.2f}")

            payload = {
                "username": username,
                "microscopeSize": microscope_size,
                "magnification": magnification,
                "originalSize": original_size
            }

            res = requests.post(f"{API_URL}/submit", json=payload)
            if res.status_code == 201:
                messagebox.showinfo("Success", "Submitted successfully!")
                self.fetch_data()
            else:
                messagebox.showerror("Error", "Failed to submit.")
        except Exception as e:
            messagebox.showerror("Error", str(e))

    def fetch_data(self):
        try:
            res = requests.get(f"{API_URL}/conversions")
            data = res.json()

            for row in self.tree.get_children():
                self.tree.delete(row)

            for item in data:
                created_at = item.get("createdAt") or item.get("submittedAt")
                if created_at:
                    try:
                        date = datetime.fromisoformat(created_at.replace("Z", "+00:00")).strftime("%Y-%m-%d %H:%M")
                    except:
                        date = created_at
                else:
                    date = "N/A"

                self.tree.insert('', tk.END, values=(
                    item.get("username"),
                    item.get("microscopeSize"),
                    item.get("magnification"),
                    round(item.get("originalSize", 0), 2),
                    date
                ))
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load data: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = MicroscopeApp(root)
    root.mainloop()
