import { useEffect } from 'react';

const useSnapshot = (firebaseRef, snapshotFn, dependencies=[]) => {
    useEffect(() => {
        const unsubscribe = firebaseRef.onSnapshot(snapshotFn)
        return unsubscribe
    }, dependencies)
}

export default useSnapshot