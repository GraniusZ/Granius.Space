import {useDispatch} from 'react-redux'
import type {AppDispatch} from '@store/store.ts'

export const useAppDispatch: () => AppDispatch = useDispatch
