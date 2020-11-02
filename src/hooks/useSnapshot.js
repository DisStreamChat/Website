import { useEffect } from "react";

// TODO: replace with react-firebase-hooks
const useSnapshot = (firebaseRef, snapshotFn, dependencies = []) => {
	useEffect(() => {
		const unsubscribe = firebaseRef.onSnapshot(snapshotFn);
		return unsubscribe;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
};

export default useSnapshot;
