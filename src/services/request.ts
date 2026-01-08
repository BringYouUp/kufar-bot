import { KUFAR_URL } from "@/config/env.ts"

class RequestService {
  getKufarDataByPath() {
    return fetch(KUFAR_URL)
      .then(data => data.text())
      .then(r => r)
  }
}

export const request = new RequestService()
