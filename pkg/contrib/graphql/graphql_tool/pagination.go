package graphql_tool

import "math"

const PerPage = 20

type PageArgs struct {
	PageNum  int32
	PageSize int32
}

type PageType struct {
	// 分页的总页数
	CurrentPage int32
	// 当前页总条数
	CurrentNum int32
	// 总条数
	Total int32
	// 单页设置的条数
	PerPage int32
}
type PageGType struct {
	*PageType
}

func (g *PageGType) CurrentPage() *int32 {
	return &g.PageType.CurrentPage
}

func (g *PageGType) CurrentNum() *int32 {
	return &g.PageType.CurrentNum
}

func (g *PageGType) Total() *int32 {
	return &g.PageType.Total
}
func (g *PageGType) PerPage() *int32 {
	return &g.PageType.PerPage
}

func GetCurrentPage(total, pageSize int32) int32 {
	return int32(math.Ceil(float64(total) / float64(pageSize)))
}

func FormatPage(page *PageArgs) *PageArgs {
	page.PageNum = (page.PageNum - 1) * page.PageSize
	return page
}
