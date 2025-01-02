import { QueryClient } from "@tanstack/react-query";
import type { Inputs } from "../components/AuthForm";

const queryClient = new QueryClient();

export default queryClient;

export async function createUser(data: Inputs) {
  const res = await fetch("http://localhost:3000/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (res.status === 417) {
    const error = await res.json();
    throw error;
  }
  if (res.status === 500) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 201) {
    const { message } = await res.json();
    console.log(message);
    return message;
  }
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 417) {
    const error = await res.json();
    throw error;
  }
  if (res.status === 500 || res.status === 401) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const resData = await res.json();

    return resData;
  }
}

export async function resetPassword(data: { email: string }) {
  const res = await fetch("http://localhost:3000/auth/resetpw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 404) {
    const error = await res.json();
    throw error;
  }
  if (res.status === 500) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const { message } = await res.json();

    return message;
  }
}

export async function getResetPasswordPermission(resetToken: string) {
  const res = await fetch("http://localhost:3000/auth/reset/" + resetToken);
  if (res.status === 500 || res.status === 401) {
    const { message } = await res.json();
    throw new Error(message);
  }
  if (res.status === 200) {
    const resData = await res.json();
    return resData;
  }
}

export async function newPassword(data: {
  password: string;
  userId: string;
  token: string;
}) {
  const res = await fetch("http://localhost:3000/auth/newpw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (res.status === 417) {
    const error = await res.json();
    throw error;
  }
  if (res.status === 500 || res.status === 401) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const resData = await res.json();
    console.log("data", resData);

    return resData;
  }
}

export async function fetchBooks() {
  const res = await fetch("http://localhost:3000/books");
  if (res.status === 500) {
    const { message } = await res.json();
    throw new Error(message);
  }
  if (res.status === 200) {
    const resData = await res.json();
    console.log(resData);

    return resData.books;
  }
}

export async function fetchUserBooks(signal: AbortSignal, token: string) {
  const res = await fetch("http://localhost:3000/admin/books", {
    headers: {
      Authorization: "Bearer " + token,
    },
    signal,
  });

  if (res.status === 500) {
    const { message } = await res.json();
    throw new Error(message);
  }
  if (res.status === 200) {
    const resData = await res.json();
    return resData.books;
  }
}

export async function addBook(args: { data: FormData; token: string }) {
  console.log(args.token);
  const res = await fetch("http://localhost:3000/admin/book", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + args.token,
    },
    body: args.data,
  });

  if (res.status === 417) {
    const error = await res.json();
    throw error;
  }
  if (res.status === 500 || res.status === 415) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const resData = await res.json();

    return resData;
  }
}

export async function fetchBook(id: string) {
  const res = await fetch("http://localhost:3000/book/" + id);

  if (res.status === 500 || res.status === 404) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const resData = await res.json();

    return resData;
  }
}

export async function editBook(args: {
  id: string;
  token: string;
  data: FormData;
}) {
  const res = await fetch("http://localhost:3000/admin/book/" + args.id, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + args.token,
    },
    body: args.data,
  });

  if (res.status === 417) {
    const error = await res.json();
    throw error;
  }
  if (
    res.status === 500 ||
    res.status === 404 ||
    res.status === 401 ||
    res.status === 415
  ) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }
  if (res.status === 200) {
    const resData = await res.json();

    return resData;
  }
}

export async function deleteBook(args: { bookId: string; token: string }) {
  const res = await fetch("http://localhost:3000/admin/book/" + args.bookId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + args.token,
    },
  });

  if (res.status === 500 || res.status === 404 || res.status === 401) {
    const { message } = await res.json();
    const error = { message };
    throw error;
  }

  if (res.status === 200) {
    const resData = await res.json();

    return resData;
  }
}
