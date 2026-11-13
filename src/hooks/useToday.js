import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as trackerService from '../services/trackerService';
import { dateKey } from '../utils/date';

/** Today's tracker log + an updater that persists through the service layer */
export function useToday() {
  const { user } = useAuth();
  const today = dateKey();
  const [day, setDay] = useState(null);

  useEffect(() => {
    let alive = true;
    trackerService.getDay(user.id, today).then((d) => alive && setDay(d));
    return () => {
      alive = false;
    };
  }, [user.id, today]);

  const update = useCallback(
    async (updater) => {
      const next = await trackerService.updateDay(user.id, today, updater);
      setDay(next);
      return next;
    },
    [user.id, today],
  );

  return { day, update, today };
}
