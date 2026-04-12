import { useState } from 'react'
import { FaTrash, FaPlus, FaTimes, FaUserShield, FaUserCog, FaUsers } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import styles from '../styles/SuperAdminDashboard.module.css'

function SuperAdminDashboard({ admins, setAdmins }) {
  const { isDark } = useTheme()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin'
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const openAddModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'admin'
    })
    setShowModal(true)
  }

  const handleAddAdmin = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill all fields')
      return
    }

    const newAdmin = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toLocaleDateString()
    }
    setAdmins([...admins, newAdmin])
    setShowModal(false)
  }

  const handleDeleteAdmin = (id) => {
    const adminToDelete = admins.find(a => a.id === id)
    if (adminToDelete.role === 'superadmin') {
      alert('Cannot delete Super Admin')
      return
    }
    if (window.confirm(`Are you sure you want to delete ${adminToDelete.name}?`)) {
      const updatedAdmins = admins.filter(a => a.id !== id)
      setAdmins(updatedAdmins)
    }
  }

  const stats = {
    total: admins.length,
    superAdmins: admins.filter(a => a.role === 'superadmin').length,
    admins: admins.filter(a => a.role === 'admin').length
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.darkContainer : ''}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Super Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage administrators and their permissions</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          <FaPlus /> Add Admin
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUsers size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.total}</h3>
            <p>Total Admins</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserCog size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.admins}</h3>
            <p>Regular Admins</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FaUserShield size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats.superAdmins}</h3>
            <p>Super Admins</p>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>#{admin.id}</td>
                <td>
                  <div className={styles.adminName}>
                    {admin.role === 'superadmin' ? '👑' : '👤'}
                    {admin.name}
                  </div>
                </td>
                <td>{admin.email}</td>
                <td>
                  <span className={`${styles.roleBadge} ${admin.role === 'superadmin' ? styles.superAdminBadge : styles.adminBadge}`}>
                    {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                  </span>
                </td>
                <td>{admin.createdAt}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteAdmin(admin.id)} 
                    className={styles.deleteBtn}
                    disabled={admin.role === 'superadmin'}
                    style={{
                      opacity: admin.role === 'superadmin' ? 0.5 : 1,
                      cursor: admin.role === 'superadmin' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add New Admin</h2>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter admin name"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="admin">Admin (Manage Properties)</option>
                  <option value="superadmin">Super Admin (Manage Admins)</option>
                </select>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleAddAdmin} className={styles.submitBtn}>
                <FaPlus /> Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdminDashboard