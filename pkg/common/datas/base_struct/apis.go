package base_struct

type (
	// APIs sync the api message
	APIs struct {
		Name     string `json:"name"`
		Address  string `json:"address"`
		Token    string `json:"token"`
		AppID    int    `json:"app_id"`
		Secret   string `json:"secret"`
		Body     string `json:"body"`
		Type     string `json:"type"`
		Timeout  int64  `json:"timeout"`
		Interval int64  `json:"interval"`
		UserId   string `json:"user_id"`
	}
)
