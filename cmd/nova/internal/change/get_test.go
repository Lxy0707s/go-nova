package change

import "testing"

func TestParseGithubURL(t *testing.T) {
	urls := []struct {
		url   string
		owner string
		repo  string
	}{
		{"https://github.com/go-nova/kratos.git", "go-nova", "kratos"},
		{"https://github.com/go-nova/kratos", "go-nova", "kratos"},
		{"git@github.com:go-nova/kratos.git", "go-nova", "kratos"},
		{"https://github.com/go-nova/go-nova.dev.git", "go-nova", "go-nova.dev"},
	}
	for _, url := range urls {
		owner, repo := ParseGithubURL(url.url)
		if owner != url.owner {
			t.Fatalf("owner want: %s, got: %s", owner, url.owner)
		}
		if repo != url.repo {
			t.Fatalf("repo want: %s, got: %s", repo, url.repo)
		}
	}
}
