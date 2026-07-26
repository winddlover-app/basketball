from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


OUT = r"C:\Users\tonyf\OneDrive\篮球APP\篮球训练营APP_PRD_产品需求文档.docx"


def set_run_font(run, name="Microsoft YaHei", size=None, bold=None, color=None):
    run.font.name = name
    run._element.rPr.rFonts.set(qn("w:ascii"), name)
    run._element.rPr.rFonts.set(qn("w:hAnsi"), name)
    run._element.rPr.rFonts.set(qn("w:eastAsia"), name)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = RGBColor.from_string(color)


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=80, start=120, bottom=80, end=120):
    tc_pr = cell._tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for m, v in [("top", top), ("start", start), ("bottom", bottom), ("end", end)]:
        node = tc_mar.find(qn(f"w:{m}"))
        if node is None:
            node = OxmlElement(f"w:{m}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(v))
        node.set(qn("w:type"), "dxa")


def keep_row_together(row):
    tr_pr = row._tr.get_or_add_trPr()
    cant_split = tr_pr.find(qn("w:cantSplit"))
    if cant_split is None:
        cant_split = OxmlElement("w:cantSplit")
        tr_pr.append(cant_split)


def set_table_width(table, widths):
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    table.autofit = False
    for row in table.rows:
        for idx, width in enumerate(widths):
            row.cells[idx].width = Inches(width)
            tc_pr = row.cells[idx]._tc.get_or_add_tcPr()
            tc_w = tc_pr.find(qn("w:tcW"))
            if tc_w is None:
                tc_w = OxmlElement("w:tcW")
                tc_pr.append(tc_w)
            tc_w.set(qn("w:type"), "dxa")
            tc_w.set(qn("w:w"), str(int(width * 1440)))
            set_cell_margins(row.cells[idx])


def style_para(paragraph, before=0, after=6, line=1.1):
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    paragraph.paragraph_format.line_spacing = line


def add_title(doc):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    style_para(p, 0, 8, 1.1)
    r = p.add_run("篮球训练营 APP 产品需求文档")
    set_run_font(r, size=22, bold=True, color="0B2545")

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    style_para(p, 0, 18, 1.1)
    r = p.add_run("面向篮球培训机构、教练、学员及家长的课程服务与训练反馈闭环")
    set_run_font(r, size=11, color="4A5568")

    meta = doc.add_table(rows=4, cols=2)
    set_table_width(meta, [1.5, 5.0])
    labels = ["文档类型", "适用对象", "版本", "日期"]
    values = [
        "产品需求文档（PRD）",
        "产品、设计、运营、业务负责人、测试与项目排期讨论",
        "V1.0",
        "2026-07-26",
    ]
    for i, row in enumerate(meta.rows):
        row.cells[0].text = labels[i]
        row.cells[1].text = values[i]
        set_cell_shading(row.cells[0], "F2F4F7")
        for cell in row.cells:
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            for para in cell.paragraphs:
                style_para(para, 0, 0, 1.1)
                for run in para.runs:
                    set_run_font(run, size=10, bold=(cell == row.cells[0]), color="111827")


def heading(doc, text, level=1):
    p = doc.add_paragraph(style=f"Heading {level}")
    p.text = text
    for run in p.runs:
        set_run_font(run, size={1: 16, 2: 13, 3: 12}.get(level, 11), bold=True, color={1: "2E74B5", 2: "2E74B5", 3: "1F4D78"}.get(level, "111827"))
    style_para(p, before={1: 16, 2: 12, 3: 8}.get(level, 6), after={1: 8, 2: 6, 3: 4}.get(level, 4), line=1.1)


def body(doc, text, bold_prefix=None):
    p = doc.add_paragraph()
    style_para(p)
    if bold_prefix and text.startswith(bold_prefix):
        r = p.add_run(bold_prefix)
        set_run_font(r, size=11, bold=True)
        r = p.add_run(text[len(bold_prefix):])
        set_run_font(r, size=11)
    else:
        r = p.add_run(text)
        set_run_font(r, size=11)
    return p


def bullet(doc, text, level=0):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Inches(-0.25)
    style_para(p, after=4, line=1.167)
    r = p.add_run(text)
    set_run_font(r, size=11)


def num(doc, text):
    p = doc.add_paragraph(style="List Number")
    p.paragraph_format.left_indent = Inches(0.5)
    p.paragraph_format.first_line_indent = Inches(-0.25)
    style_para(p, after=4, line=1.167)
    r = p.add_run(text)
    set_run_font(r, size=11)


def add_table(doc, headers, rows, widths):
    table = doc.add_table(rows=1, cols=len(headers))
    table.style = "Table Grid"
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        set_cell_shading(cell, "F2F4F7")
    for row in rows:
        cells = table.add_row().cells
        for i, value in enumerate(row):
            cells[i].text = value
    set_table_width(table, widths)
    for ri, row in enumerate(table.rows):
        keep_row_together(row)
        for cell in row.cells:
            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            for para in cell.paragraphs:
                style_para(para, 0, 0, 1.1)
                for run in para.runs:
                    set_run_font(run, size=9.5, bold=(ri == 0), color="111827")
    return table


def page_break(doc):
    p = doc.add_paragraph()
    p.add_run().add_break(WD_BREAK.PAGE)


doc = Document()
section = doc.sections[0]
section.top_margin = Inches(1)
section.bottom_margin = Inches(1)
section.left_margin = Inches(1)
section.right_margin = Inches(1)
section.header_distance = Inches(0.492)
section.footer_distance = Inches(0.492)

styles = doc.styles
for name in ["Normal", "Heading 1", "Heading 2", "Heading 3", "List Bullet", "List Number"]:
    st = styles[name]
    st.font.name = "Microsoft YaHei"
    st._element.rPr.rFonts.set(qn("w:eastAsia"), "Microsoft YaHei")
    st.font.size = Pt(11)

add_title(doc)

heading(doc, "1. 产品概述", 1)
body(doc, "篮球训练营 APP 面向篮球培训机构、教练、学员及家长，目标是将课程报名、上课服务、课后训练、视频分析、教练反馈和成长记录整合为一个可持续沉淀的服务闭环。")
body(doc, "本产品优先解决线下培训服务中信息分散、课后训练不可追踪、视频反馈难沉淀、教练评价缺少统一出口等问题，让机构能够以更标准化的方式交付课程服务。")

heading(doc, "2. 产品目标", 1)
bullet(doc, "完成课程服务线上化：学员/家长可浏览课程、报名、支付、查看课表和课程状态。")
bullet(doc, "完成课后训练可追踪：教练可布置训练任务，学员可按任务提交训练视频，双方可查看进度。")
bullet(doc, "完成训练视频可分析：系统可基于视频形成初步训练数据和纠正建议，并展示可复看的分析结果。")
bullet(doc, "完成教练反馈可沉淀：教练复核后发布正式反馈，学员/家长可查看报告，长期形成成长趋势。")
bullet(doc, "提升机构服务标准化：通过统一流程、统一状态、统一报告口径，提高服务质量与续费转化基础。")

heading(doc, "3. 用户角色与核心价值", 1)
add_table(doc, ["角色", "核心需求", "产品价值"], [
    ["学员", "知道练什么、怎么练、哪里做得不好", "查看任务、上传训练视频、获得反馈和成长记录"],
    ["家长", "知道孩子上课和训练是否有效", "查看课程、订单、训练反馈和阶段性成长记录"],
    ["教练", "降低课后跟进成本，提高点评效率", "点名、布置任务、查看视频、复核报告、发布评价"],
    ["机构运营", "提升服务标准化和续费转化", "配置课程、学员、教练、支付、视频和报告状态"],
    ["超级管理员", "管理用户准入和业务全局信息", "审核家长/教练注册、管理用户清单、追溯课程和反馈记录"],
], [1.0, 2.4, 3.1])

heading(doc, "4. 服务流程", 1)
num(doc, "学员/家长浏览课程，并根据校区、年龄、水平、日期和教练筛选合适课程。")
num(doc, "学员/家长提交报名并完成支付，系统生成个人课表和课次记录。")
num(doc, "教练端同步今日课程和学员名单，课前查看班级信息和安全备注。")
num(doc, "教练上课点名，记录到课、迟到、请假、缺勤等状态。")
num(doc, "教练为个人或班级布置课后训练任务，可关联动作、次数、示范视频、截止时间和完成标准。")
num(doc, "学员按任务录制或上传训练视频，查看上传与分析状态。")
num(doc, "系统生成初步训练数据、关键片段和纠正建议。")
num(doc, "教练复核结果，确认、修改或隐藏建议后正式发布。")
num(doc, "学员/家长查看反馈报告，系统沉淀训练记录和成长趋势。")

heading(doc, "5. 范围规划", 1)
heading(doc, "5.1 一阶段范围", 2)
bullet(doc, "公共账号与基础资料：注册登录、角色识别与切换、个人资料、隐私授权、监护人绑定、超级管理员用户管理。")
bullet(doc, "学员/家长端课程闭环：课程浏览、课程详情、报名、支付、订单/课时、课程与训练反馈查看、请假调课补课申请。")
bullet(doc, "教练端上课与反馈闭环：今日课程、周课表、学员名单、安全备注、点名、AI 报告复核、训练计划、教练示范视频、训练任务与历史记录。")
bullet(doc, "视频动作分析辅助：录制/导入视频、选择训练项目、拍摄提示、上传状态、投篮和运球基础识别、关键点与角度、文字建议、报告与片段保存。")
bullet(doc, "消息通知：通过邮件发送课前提醒、调课、停课等通知。")

heading(doc, "5.2 二阶段范围", 2)
bullet(doc, "学员/家长端增强：个人课表与课次详情，支持列表/日历展示。")
bullet(doc, "教练端增强：任务布置、任务提交筛选、训练视频查看、任务验收、退回和评价。")
bullet(doc, "AI 辅助增强：实时低延迟分析作为后续能力，单独评估产品价值与上线条件。")
bullet(doc, "服务支持增强：联系客服或提交问题反馈，支持填写问题、联系方式和截图，并查看处理状态。")

heading(doc, "6. 一阶段功能需求", 1)
heading(doc, "6.1 公共账号与基础功能", 2)
add_table(doc, ["编号", "功能需求", "验收口径"], [
    ["APP-001", "邮箱密码注册、登录、退出登录", "验证码有效期、频控和异常提示清晰；退出后账号状态正确。"],
    ["APP-002", "支持学员、家长、教练角色识别与切换", "不同角色仅展示对应功能和数据；切换角色后页面内容同步刷新。"],
    ["APP-003", "个人资料维护", "支持头像、姓名、性别、生日、联系方式；必填项有明确提示；修改后相关页面同步。"],
    ["APP-004", "未成年学员绑定监护人", "未成年人报名课程时可匹配父母邮箱；邮箱和出生年月一致时可完成绑定；家长可切换查看多个孩子。"],
    ["APP-005", "隐私政策、用户协议、监护人授权确认", "记录同意版本和时间；未授权时限制视频提交与 AI 分析相关功能。"],
    ["APP-006", "超级管理员管理家长和教练注册及注销", "可清单式管理用户信息，并追溯家长关联学员、课程、开户时长、学员课程历史和教练反馈。"],
], [0.85, 2.4, 3.25])

heading(doc, "6.2 学员/家长端", 2)
add_table(doc, ["编号", "功能需求", "验收口径"], [
    ["STU-001", "浏览课程列表并筛选", "可按校区、年龄、水平、日期、教练筛选；列表显示价格、剩余名额、时间、适龄范围和状态。"],
    ["STU-002", "查看课程详情并提交报名", "校验年龄、容量和报名资格；重复报名时给出明确提示。"],
    ["STU-003", "在线支付课程费用并查看支付结果", "支付成功后订单、名额、课时同步；失败后可重试并看到结果。"],
    ["STU-007", "查看教练评分、文字评价、AI 报告和历史训练记录", "报告与课程或任务关联；支持按时间和训练项目筛选。"],
    ["STU-008", "请假、调课、补课申请", "展示规则和处理状态；处理结果同步到个人课表。"],
    ["STU-009", "阶段训练报告分享给指定监护人", "分享可取消；报告包含教练评价、AI 指标和趋势。"],
], [0.85, 2.4, 3.25])

heading(doc, "6.3 教练端", 2)
add_table(doc, ["编号", "功能需求", "验收口径"], [
    ["COA-001", "查看今日课程、周课表和课程详情", "只显示本人或被授权课程；课程变更及时同步。"],
    ["COA-002", "查看班级学员名单、基础档案和安全备注", "敏感信息受限；仅授权学员可见。"],
    ["COA-003", "课程点名", "可记录到课、迟到、请假、缺勤；支持批量操作；保存后可追溯。"],
    ["COA-007", "复核 AI 报告，确认、修改或隐藏建议", "发布前必须有明确教练确认状态；保留修改记录。"],
    ["COA-008", "创建和调整个人训练计划", "可引用模板；调整后学员端同步。"],
    ["COA-009", "快速录制教练示范视频", "视频可关联任务或计划；支持重拍和删除。"],
    ["COA-010", "查看训练任务、视频上传、分析状态、训练反馈和历史记录", "教练可围绕学员、课程、任务查看完整训练服务记录。"],
], [0.85, 2.4, 3.25])

heading(doc, "6.4 视频动作分析 AI 辅助", 2)
add_table(doc, ["编号", "功能需求", "验收口径"], [
    ["AI-001", "录制或导入训练视频", "支持开始、暂停、结束、重拍；相机和相册权限提示清晰。"],
    ["AI-002", "拍摄前选择训练项目", "支持定点投篮、罚球、原地/基础运球；不同项目展示对应拍摄指引和分析指标。"],
    ["AI-003", "提供拍摄指引", "提示机位、距离、光线、全身入镜和录制区域范围；不满足条件时给出调整建议。"],
    ["AI-004", "视频上传与失败重试", "弱网下可继续处理；失败后提示原因并允许重试；避免重复创建同一训练记录。"],
    ["AI-005", "投篮识别", "展示出手次数、命中/未命中、命中率和关键时间点；低置信度时允许人工纠正。"],
    ["AI-006", "运球识别", "展示次数、左右手和节奏；结果可按片段查看；支持人工纠正计数。"],
    ["AI-007", "人体关键点和基础角度展示", "指标关联关键帧；无法识别时展示失败原因。"],
    ["AI-008", "生成文字纠正建议和推荐练习", "建议具体、可执行，并关联问题片段；需教练复核后发布。"],
    ["AI-009", "保存 AI 分析报告和关键视频片段", "报告可再次查看；删除视频时提示对报告的影响。"],
    ["AI-011", "运球持球与动作间隙识别", "展示有效时间内持球时长，以及进入下一个动作的空隙时长。"],
], [0.85, 2.4, 3.25])

heading(doc, "6.5 消息通知与服务", 2)
add_table(doc, ["编号", "功能需求", "验收口径"], [
    ["MSG-002", "接收课前提醒、调课、停课通知", "所有通知以邮件形式发送；通知包含课程、时间、地点和变更内容。"],
], [0.85, 2.4, 3.25])

heading(doc, "7. 二阶段功能需求", 1)
add_table(doc, ["模块", "编号", "功能需求", "验收口径"], [
    ["学员/家长端", "STU-005", "查看个人课表和课次详情", "支持列表/日历展示；展示时间、地点、教练和状态。"],
    ["教练端", "COA-004", "为个人或班级布置训练任务", "可设置动作、次数、示范视频、截止时间和完成标准。"],
    ["教练端", "COA-005", "查看任务提交、训练视频和 AI 分析状态", "可按未提交、待分析、待评价、已完成筛选。"],
    ["教练端", "COA-006", "验收、退回任务并添加评价", "退回时需填写原因；学员收到通知。"],
    ["AI 辅助", "AI-010", "实时低延迟分析", "作为二阶段后能力，需单独评估使用场景、准确性和成本收益。"],
    ["消息与服务", "MSG-005", "联系客服或提交问题反馈", "可填写问题、联系方式并上传截图；显示处理状态。"],
], [1.05, 0.75, 2.35, 2.35])

heading(doc, "8. 关键页面清单", 1)
add_table(doc, ["端", "页面/模块", "说明"], [
    ["公共", "登录/注册、角色选择、隐私授权、个人资料", "所有角色共用基础入口。"],
    ["学员/家长", "首页、课程列表、课程详情、报名确认、支付结果、订单/课时、个人课表", "完成课程消费闭环。"],
    ["学员/家长", "训练任务、视频上传、上传/分析状态、训练反馈、历史记录", "完成课后训练闭环。"],
    ["教练", "教练首页、今日课程、学员名单、点名、任务布置、提交列表、视频查看", "突出待处理事项。"],
    ["教练", "AI 报告复核、评价发布、训练记录查看", "作为 AI 结果正式发布前的人工确认入口。"],
    ["消息", "消息中心、通知详情、设置", "所有消息均通过邮件发送，不设置 APP 内提醒。"],
    ["机构/管理", "用户管理、课程管理、报名订单、课表管理、反馈报告管理", "支撑机构运营和超级管理员管理。"],
], [1.0, 2.6, 2.9])

heading(doc, "9. 核心业务规则", 1)
heading(doc, "9.1 报名与课表", 2)
bullet(doc, "课程需展示校区、时间、地点、教练、适龄范围、水平要求、价格、剩余名额和课程状态。")
bullet(doc, "报名时需校验年龄、课程容量、报名资格和重复报名。")
bullet(doc, "支付成功后，订单、名额、课时和个人课表需要同步更新。")
bullet(doc, "请假、调课、补课申请需展示规则、处理状态和最终结果。")

heading(doc, "9.2 监护人与授权", 2)
bullet(doc, "未成年学员需要完成监护人绑定后，家长才能查看课程、订单、训练反馈和成长记录。")
bullet(doc, "监护人绑定可基于父母邮箱和学员出生年月完成匹配。")
bullet(doc, "隐私政策、用户协议和监护人授权需记录同意版本和同意时间。")
bullet(doc, "未完成必要授权时，视频提交和 AI 分析相关功能应被限制。")

heading(doc, "9.3 训练任务与视频", 2)
bullet(doc, "训练任务需明确动作、次数、示范视频、截止时间和完成标准。")
bullet(doc, "学员提交视频前需选择训练项目，并获得对应拍摄指引。")
bullet(doc, "视频上传失败时需提示原因并支持重试；同一训练提交不应重复生成记录。")
bullet(doc, "训练视频、AI 报告、教练评价需要与课程或训练任务关联。")

heading(doc, "9.4 AI 报告与教练复核", 2)
bullet(doc, "AI 输出仅作为初步数据和建议，不直接作为正式反馈发布给学员/家长。")
bullet(doc, "教练发布前必须进行复核，并可确认、修改或隐藏建议。")
bullet(doc, "低置信度、无法识别或可能误导的结果，应提示原因并允许人工纠正。")
bullet(doc, "教练修改记录需要保留，便于后续追溯服务质量。")

heading(doc, "10. 关键状态定义", 1)
add_table(doc, ["对象", "状态", "说明"], [
    ["课程", "未开始、报名中、已满员、已开课、已结束、已取消", "用于课程列表、详情、课表和通知。"],
    ["订单", "待支付、支付成功、支付失败、已取消、已退款", "用于家长/学员查看报名与费用结果。"],
    ["课次", "待上课、已到课、迟到、请假、缺勤、已补课", "用于点名、课表和课时记录。"],
    ["训练任务", "未开始、待提交、已提交、待分析、待评价、已完成、已退回", "用于学员提交和教练处理。"],
    ["视频", "待上传、上传中、上传失败、已上传、分析中、分析失败、分析完成", "用于上传和分析过程展示。"],
    ["反馈报告", "待复核、已确认、已修改、已隐藏建议、已发布", "用于教练复核和学员/家长查看。"],
], [1.05, 2.05, 3.4])

heading(doc, "11. 报告内容要求", 1)
bullet(doc, "训练基本信息：学员、课程或任务、训练项目、提交时间、教练和报告状态。")
bullet(doc, "视频结果摘要：关键片段、投篮或运球数据、可识别动作区间和异常提示。")
bullet(doc, "AI 初步建议：问题描述、对应片段、建议动作和推荐练习。")
bullet(doc, "教练正式反馈：教练评分、文字评价、修改后的训练建议、是否需要补练或重交。")
bullet(doc, "成长趋势：按时间和训练项目展示历史记录，帮助学员/家长理解阶段性变化。")

heading(doc, "12. 产品体验与合规要求", 1)
bullet(doc, "关键流程提示要清晰，尤其是报名失败、支付失败、视频上传失败、无法识别和报告待复核等场景。")
bullet(doc, "不同角色只能看到与自己相关的课程、学员、订单、视频和报告。")
bullet(doc, "涉及未成年人、监护人授权、视频上传和 AI 分析的功能，需要在使用前呈现明确授权说明。")
bullet(doc, "AI 建议需要避免绝对化表达，正式反馈以教练复核发布内容为准。")
bullet(doc, "消息通知统一通过邮件发送，通知内容需包含课程、时间、地点和变更事项。")

heading(doc, "13. 成功指标", 1)
bullet(doc, "课程报名转化：课程详情访问到报名提交、支付成功的转化情况。")
bullet(doc, "课后训练完成：训练任务提交率、按时提交率、退回后再次提交率。")
bullet(doc, "教练处理效率：待评价任务数量、报告复核时长、任务完成闭环时长。")
bullet(doc, "家长/学员参与：反馈报告查看率、阶段报告分享率、历史记录访问情况。")
bullet(doc, "机构服务沉淀：学员课程历史完整率、训练报告沉淀数量、续费转化参考数据。")

heading(doc, "14. 首期验收标准", 1)
bullet(doc, "学员/家长能够完成从浏览课程到报名支付、查看个人课表的完整流程。")
bullet(doc, "教练能够查看今日课程和学员名单，并完成点名记录。")
bullet(doc, "教练能够布置训练相关内容，学员能够提交训练视频并查看处理状态。")
bullet(doc, "系统能够生成训练初步数据和建议，教练能够复核后发布正式反馈。")
bullet(doc, "学员/家长能够查看训练反馈报告和历史训练记录。")
bullet(doc, "超级管理员能够管理家长、教练等用户准入，并追溯关键服务记录。")

heading(doc, "15. PRD 缺失点与补充建议", 1)
body(doc, "以下内容基于当前 PRD 与同类篮球训练、视频分析、教练反馈类产品调研补充，用于进入原型设计、排期和业务确认前进一步完善需求边界。")
add_table(doc, ["缺失点", "当前影响", "补充建议"], [
    ["商业模式不清", "影响机构端权限、付费入口、套餐设计和运营后台优先级。", "明确产品是机构 SaaS、单机构定制、按学员收费、按教练席位收费，还是课程交易抽佣；首期建议按机构服务闭环设计，不在学员端过早强化会员订阅。"],
    ["课程商品形态不清", "课程列表、订单、课时和课表规则容易混乱。", "补充单节课、课包、训练营、班课、私教课的定义，并明确每类课程是否支持报名、请假、调课、补课和退款。"],
    ["支付与退款规则不完整", "会影响报名闭环、客服处理和家长信任。", "增加取消订单、支付失败重试、退款、课时过期、优惠码、补差价等规则；首期至少明确支付成功、失败、取消、退款四类结果。"],
    ["机构后台范围偏粗", "管理员和运营人员的真实工作流不够明确。", "明确机构后台是 APP 内管理端还是独立 Web 管理端；建议首期至少覆盖用户审核、课程管理、订单查看、课表管理、报告状态追踪。"],
    ["AI 指标定义不足", "容易造成识别能力过度承诺，也会影响报告可信度。", "明确首期必做指标、可选指标和不展示指标；投篮优先出手次数、命中/未命中、命中率、关键时间点，运球优先次数、左右手、节奏和持球时长。"],
    ["教练复核标准不足", "AI 建议如何变成正式反馈的边界不够清晰。", "细化待复核、已确认、已修改、隐藏建议、已发布的操作权限、展示状态和修改记录；明确未复核报告不得对学员/家长展示为正式结论。"],
    ["训练内容体系不足", "教练每次布置任务成本高，学员也难以理解训练目标。", "增加训练项目库、任务模板、示范视频库、推荐练习库；首期可先做基础模板，二期再做机构自定义模板。"],
    ["家长价值表达不足", "家长端可能只看到数据，难以感知服务价值。", "反馈报告中强化孩子是否上课、是否完成训练、哪里进步、教练怎么建议、下一步练什么；阶段报告应服务续费与家长沟通。"],
    ["消息策略偏弱", "仅邮件可能导致课前提醒、任务退回、报告发布触达不足。", "首期按邮件实现，但在产品结构中预留短信、APP 推送或 WhatsApp 等通知渠道；关键通知应支持发送记录和失败状态。"],
    ["英文界面术语需统一", "后续 UI、原型、测试用例和开发沟通可能出现命名不一致。", "统一使用 Training Task、Session、Coach Review、AI Analysis、Feedback Report、Growth Trend、Makeup Class 等英文术语。"],
], [1.35, 2.35, 2.8])

heading(doc, "16. 基于竞品调研的产品建议", 1)
bullet(doc, "首期不建议以实时 AI 分析作为核心卖点，应优先跑通课程服务、课后训练提交、异步分析、教练复核和报告查看闭环。")
bullet(doc, "AI 能力应定位为教练提效工具，而不是替代教练；所有对学员/家长展示的正式建议必须经过教练确认。")
bullet(doc, "训练任务需要模板化，否则教练端会因为布置成本高而难以持续使用；建议建立基础动作库、训练目标、完成标准和示范视频。")
bullet(doc, "家长端应避免堆砌技术指标，重点呈现孩子是否按时上课、是否完成练习、阶段变化和教练下一步建议。")
bullet(doc, "学员端需要适度游戏化或进度反馈，例如训练完成状态、连续提交、阶段徽章或目标达成，但首期不做公开排行榜。")
bullet(doc, "机构端需要围绕服务追踪建立数据闭环，例如待复核报告数、任务完成率、学员活跃度、课程续费线索。")
bullet(doc, "视频分析报告应区分系统识别结果、低置信度提示和教练正式评价，避免让用户误以为 AI 结果就是最终结论。")
bullet(doc, "后续可补充设备或场馆侧能力，但首期应保持手机录制/上传为主，降低机构和学员使用门槛。")

heading(doc, "17. 暂不纳入首期范围", 1)
bullet(doc, "实时低延迟训练分析。")
bullet(doc, "复杂内容社区、训练内容商城或公开排行榜。")
bullet(doc, "面向赛事组织、球队管理或大型俱乐部的深度管理功能。")
bullet(doc, "非课程服务相关的泛运动社交功能。")

for section in doc.sections:
    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = footer.add_run("篮球训练营 APP PRD")
    set_run_font(r, size=9, color="6B7280")

doc.save(OUT)
print(OUT)
