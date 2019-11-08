import React from 'react';
import styles from './index.css';
import Link from 'umi/link';

export default function() {
  return (
    <div className={styles.normal}>
      <Link to="/workflowdesigner">Go to wrokflow designer</Link>
    </div>
  );
}
