import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingContact() {
  return (
    <motion.a
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      href="https://wa.me/918281122009"
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        backgroundColor: '#25D366',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
        zIndex: 100,
        transition: 'transform 0.3s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.031 0C5.385 0 0 5.386 0 12.033C0 14.157 0.554 16.196 1.551 17.971L0.499 21.823L4.444 20.785C6.155 21.688 8.056 22.176 12.029 22.176C18.675 22.176 24.06 16.791 24.06 10.142C24.06 3.493 18.677 0 12.031 0ZM18.529 16.275C18.257 17.039 17.18 17.659 16.326 17.838C15.748 17.959 14.978 18.067 12.394 16.995C9.09 15.625 6.945 12.28 6.782 12.063C6.619 11.846 5.438 10.274 5.438 8.647C5.438 7.02 6.252 6.233 6.577 5.908C6.848 5.637 7.282 5.501 7.689 5.501C7.825 5.501 7.947 5.507 8.055 5.512C8.38 5.526 8.543 5.54 8.76 6.069C9.031 6.733 9.695 8.358 9.776 8.521C9.858 8.683 9.939 8.887 9.831 9.09C9.722 9.293 9.641 9.415 9.478 9.591C9.315 9.767 9.166 9.917 9.003 10.106C8.827 10.296 8.637 10.5 8.841 10.852C9.044 11.204 9.694 12.266 10.647 13.116C11.879 14.215 12.872 14.567 13.251 14.73C13.577 14.865 13.97 14.838 14.173 14.608C14.431 14.323 14.743 13.849 15.068 13.375C15.312 13.009 15.61 12.968 15.935 13.09C16.26 13.212 17.981 14.066 18.334 14.242C18.686 14.418 18.917 14.5 19.012 14.662C19.107 14.825 19.107 15.511 18.529 16.275Z"/>
      </svg>
    </motion.a>
  );
}
