import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../actions/userActions';
import { useEffect} from 'react'
function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const isLoading = useSelector(state => state.user.isLoading);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return isLoading ? <div>Loading...</div> : <div>{user.name}</div>;
}
export default UserProfile