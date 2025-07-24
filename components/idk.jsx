"user client"

import {useState, useEffect, useCallback} from "react"

const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(()=> fn(...args), delay)
    }
}
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function IDK(){
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/users?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
    setLoading(false);
  }, []);

   const fetchDebounce = useCallback(debounce(fetchUsers, 500),[fetchUsers])

 function handleSearch(e) {
    setSearch(e.target.value);
  }

   useEffect(() => {
     fetchDebounce(search);
   }, [search, fetchDebounce])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">IDK Component</h1>
            <input 
            type="text"
            placeholder="search user "
            onChange={handleSearch}
            />
            <table className="min-w-full border border-gray-200">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 border-b">Name</th>
              <th className="text-left px-4 py-2 border-b">Face ID</th>
              <th className="px-4 py-2 border-b">Action</th>
            </tr>
            </thead>
            <tbody>
                {users.length === 0 && !loading && (
             <tr
                  key="empty"
            >
                  <td colSpan="3" className="text-center py-4">
                    No users found.
                  </td>
                </tr> 
              )}
                {users.map(user =>(
                    <tr key={user.face_id}>
                        <td >{user.name}</td>  
                        <td >{user.face_id}</td>                  
                    </tr>
                ))}
            
            </tbody>
         </table>
        </div>
    )
}