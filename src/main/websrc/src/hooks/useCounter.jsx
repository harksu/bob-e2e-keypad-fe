"use client";

import {useMemo, useState} from 'react';
import axios from "axios";
import {JSEncrypt} from "jsencrypt";

export default function useCounter() {
  const [count, setCount] = useState(0);

  const increase = () => {
    setCount(prevState => {
      console.log(`prevState=${prevState}`);
      return prevState + 1
    })
  }

  return {
    states: {
      count
    },
    actions: {
      increase,
    }
  }
}
