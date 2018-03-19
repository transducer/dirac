(ns dirac.options.core
  (:require [cljs.core.async :refer [<! go]]
            [dirac.options.ui :as ui]
            [dirac.options.model :as model]))

(defn init! []
  (go
    (<! (model/init!))
    (ui/start-ui!)))
