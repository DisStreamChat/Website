import { useEffect } from "react";

const useSnapshot = (firebaseRef, snapshotFn, dependencies = []) => {
	useEffect(() => {
		const unsubscribe = firebaseRef.onSnapshot(snapshotFn);
		return unsubscribe;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
};

export default useSnapshot;
