from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path('/Users/claudiaochoa/Documents/Projects/claudia-ochoa')
OUTPUT = ROOT / 'output/pdf/Claudia_Ochoa_Resume.pdf'

ESPRESSO = colors.HexColor('#2D211B')
CLAY = colors.HexColor('#A54F33')
CLAY_DEEP = colors.HexColor('#7D3B28')
CREAM = colors.HexColor('#F7F0E3')
SAND = colors.HexColor('#E8DDCC')
INK_SOFT = colors.HexColor('#5D514A')
WHITE = colors.white

pdfmetrics.registerFont(TTFont('Georgia', '/System/Library/Fonts/Supplemental/Georgia.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Bold', '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'))
pdfmetrics.registerFont(TTFont('Georgia-Italic', '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'))
pdfmetrics.registerFont(TTFont('Arial', '/System/Library/Fonts/Supplemental/Arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', '/System/Library/Fonts/Supplemental/Arial Bold.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Italic', '/System/Library/Fonts/Supplemental/Arial Italic.ttf'))
pdfmetrics.registerFontFamily('Arial', normal='Arial', bold='Arial-Bold', italic='Arial-Italic')
pdfmetrics.registerFontFamily('Georgia', normal='Georgia', bold='Georgia-Bold', italic='Georgia-Italic')


class ResumeDoc(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=letter,
            leftMargin=0.65 * inch,
            rightMargin=0.65 * inch,
            topMargin=0.62 * inch,
            bottomMargin=0.55 * inch,
            title='Claudia Ochoa - AI Experience and Product Design Leader',
            author='Claudia Ochoa',
            subject='Resume',
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            leftPadding=0,
            rightPadding=0,
            topPadding=0,
            bottomPadding=0,
        )
        self.addPageTemplates(PageTemplate(id='resume', frames=[frame], onPage=draw_page))


def draw_page(canvas: Canvas, doc):
    canvas.saveState()
    width, height = letter
    canvas.setFillColor(CREAM)
    canvas.rect(0, height - 0.17 * inch, width, 0.17 * inch, stroke=0, fill=1)
    canvas.setFillColor(CLAY)
    canvas.rect(0, height - 0.17 * inch, 1.65 * inch, 0.17 * inch, stroke=0, fill=1)
    canvas.setStrokeColor(SAND)
    canvas.line(doc.leftMargin, 0.37 * inch, width - doc.rightMargin, 0.37 * inch)
    canvas.setFont('Arial', 7.5)
    canvas.setFillColor(INK_SOFT)
    canvas.drawString(doc.leftMargin, 0.22 * inch, 'claudiaochoa.co  |  linkedin.com/in/claudiajochoa')
    canvas.drawRightString(width - doc.rightMargin, 0.22 * inch, str(doc.page))
    canvas.restoreState()


styles = getSampleStyleSheet()
name_style = ParagraphStyle(
    'Name', fontName='Georgia-Bold', fontSize=25, leading=27, textColor=ESPRESSO, spaceAfter=3
)
title_style = ParagraphStyle(
    'Title', fontName='Arial-Bold', fontSize=9.3, leading=11, textColor=CLAY_DEEP,
    tracking=1.1, spaceAfter=7
)
contact_style = ParagraphStyle(
    'Contact', fontName='Arial', fontSize=8.7, leading=11, textColor=INK_SOFT, spaceAfter=11
)
section_style = ParagraphStyle(
    'Section', fontName='Arial-Bold', fontSize=8.4, leading=10, textColor=CLAY_DEEP,
    tracking=1.0, spaceBefore=8, spaceAfter=5
)
summary_style = ParagraphStyle(
    'Summary', fontName='Arial', fontSize=9.25, leading=12.4, textColor=ESPRESSO, spaceAfter=5
)
role_style = ParagraphStyle(
    'Role', fontName='Georgia-Bold', fontSize=11.1, leading=13, textColor=ESPRESSO, spaceAfter=1
)
company_style = ParagraphStyle(
    'Company', fontName='Arial-Bold', fontSize=8.8, leading=10.5, textColor=CLAY_DEEP, spaceAfter=3
)
body_style = ParagraphStyle(
    'Body', fontName='Arial', fontSize=8.45, leading=11.25, textColor=INK_SOFT, spaceAfter=3
)
bullet_style = ParagraphStyle(
    'Bullet', fontName='Arial', fontSize=8.35, leading=10.9, textColor=ESPRESSO,
    leftIndent=12, firstLineIndent=-7, bulletIndent=0, spaceAfter=1.7
)
small_style = ParagraphStyle(
    'Small', fontName='Arial', fontSize=8.2, leading=10.6, textColor=ESPRESSO, spaceAfter=2
)
impact_number_style = ParagraphStyle(
    'ImpactNumber', fontName='Georgia-Bold', fontSize=12.2, leading=13, textColor=CLAY_DEEP,
    alignment=TA_CENTER, spaceAfter=2
)
impact_label_style = ParagraphStyle(
    'ImpactLabel', fontName='Arial', fontSize=7.5, leading=9.2, textColor=INK_SOFT,
    alignment=TA_CENTER
)


def P(text, style):
    return Paragraph(text, style)


def section(title):
    return [P(title.upper(), section_style), HRFlowable(width='100%', thickness=0.7, color=SAND, spaceAfter=5)]


def bullets(items):
    return [P(f'- {item}', bullet_style) for item in items]


def role(title, company, dates, intro, items):
    content = [
        P(title, role_style),
        P(f'{company}  |  <font name="Arial"><i>{dates}</i></font>', company_style),
        P(intro, body_style),
        *bullets(items),
        Spacer(1, 5),
    ]
    return KeepTogether(content)


story = [
    P('Claudia Ochoa', name_style),
    P('AI EXPERIENCE &amp; PRODUCT DESIGN LEADER', title_style),
    P(
        '<link href="https://claudiaochoa.co" color="#5D514A">claudiaochoa.co</link>'
        '  |  <link href="https://www.linkedin.com/in/claudiajochoa/" color="#5D514A">linkedin.com/in/claudiajochoa</link>',
        contact_style,
    ),
    *section('Leadership Profile'),
    P(
        '<b>AI experience and product design leader with 20+ years of experience</b> connecting emerging technology, '
        'business strategy, and human-centered design. Builds enterprise products, teams, and operating clarity '
        'across complex organizations. Known for turning ambiguous problems into useful experiences, aligning '
        'executives and cross-functional partners, and carrying a coherent product vision through delivery.',
        summary_style,
    ),
    Spacer(1, 4),
]

impact_data = [[
    [P('0 to 16', impact_number_style), P('Scaled Walmart People Product &amp; Design team', impact_label_style)],
    [P('24 hours', impact_number_style), P('Built an end-to-end GenAI hiring direction', impact_label_style)],
    [P('20+ years', impact_number_style), P('Product, UX, brand, and creative leadership', impact_label_style)],
]]
impact_table = Table(impact_data, colWidths=[story_width := (letter[0] - 2 * 0.65 * inch) / 3] * 3)
impact_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), CREAM),
    ('BOX', (0, 0), (-1, -1), 0.6, SAND),
    ('INNERGRID', (0, 0), (-1, -1), 0.6, SAND),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.extend([
    impact_table,
    *section('Core Expertise'),
    P(
        '<b>AI experience strategy</b>  |  Human-centered AI  |  Responsible AI frameworks  |  Product vision and roadmaps  |  '
        'Design organization leadership  |  Enterprise UX  |  Customer research  |  Design systems  |  Accessibility  |  '
        'Prototyping  |  Executive storytelling  |  Cross-functional alignment  |  Figma  |  v0.dev',
        small_style,
    ),
    *section('Professional Experience'),
    role(
        'Founder &amp; AI Product Lead',
        'Bible Study',
        'May 2025 - Present',
        'Conceived and built an AI-powered Bible study and faith-formation platform from concept to working MVP.',
        [
            'Own product vision, roadmap, experience strategy, content architecture, brand, and front-end implementation as a solo founder.',
            'Designed AI-assisted guidance around Scripture, reflection, readings, saints, and prayer while preserving a clear, human learning experience.',
            'Use generative AI across research, content, design exploration, prototyping, and development to accelerate iteration without surrendering product judgment.',
            'Established a scalable foundation for ongoing feature development, user feedback, and future platform growth.',
        ],
    ),
    role(
        'Senior User Experience Designer / Interim Design Manager',
        'Walmart',
        'July 2024 - May 2025',
        'Led design across internal People products, team formation, and AI-enabled candidate experiences.',
        [
            'Scaled the People Product &amp; Design team from 0 to 16 full-time hires, managing contractors while establishing hiring practices, onboarding, and team culture.',
            'Served as interim design manager, mentoring designers and aligning execution, resources, and career development with business objectives.',
            'Designed an end-to-end conversational GenAI candidate experience in 24 hours; earned executive approval and was positioned as Creative Director for the broader initiative.',
            'Partnered with product managers on roadmaps, priorities, resourcing, and delivery; facilitated workshops introducing v0.dev for faster prototyping.',
            'Directed visual design, storytelling, and photography strategy to humanize store associates and strengthen Walmart\'s employer brand.',
        ],
    ),
    PageBreak(),
    P('Claudia Ochoa', ParagraphStyle('PageName', parent=name_style, fontSize=17, leading=19, spaceAfter=2)),
    P('AI EXPERIENCE &amp; PRODUCT DESIGN LEADER', ParagraphStyle('PageTitle', parent=title_style, fontSize=8.2, spaceAfter=9)),
    *section('Professional Experience - Continued'),
    role(
        'Senior User Experience Designer',
        'The Home Depot',
        'November 2019 - April 2024',
        'Owned enterprise and customer-facing product design across complex, cross-functional initiatives.',
        [
            'Led flagship e-commerce experiences from discovery through delivery with product managers and engineers in agile teams.',
            'Led the Military Discount initiative from concept through delivery, aligning executive leadership around an experience supporting veterans and military families.',
            'Combined interviews, usability testing, Google Analytics, and Quantum Metric insights to prioritize improvements and validate design decisions.',
            'Contributed to company-wide design-system standards and roadmap planning, balancing customer value, consistency, and delivery constraints.',
        ],
    ),
    role(
        'Senior User Interface Designer',
        'Dell',
        'August 2018 - June 2019',
        'Designed a global enterprise shipment-tracking experience that made complex logistics data easier for business customers to act on.',
        [
            'Partnered with UX architects, product stakeholders, and customers to align workflows, interaction design, and operational needs.',
            'Synthesized customer interviews into simplified information architecture, modernized interface patterns, and clearer task flows.',
            'Delivered high-fidelity prototypes and implementation-ready specifications in close partnership with engineering.',
        ],
    ),
    role(
        'Founder &amp; Product Lead',
        'Nebulae',
        'October 2016 - August 2018',
        'Founded and launched a web-based platform, leading product, experience, brand, and go-to-market execution.',
        [
            'Defined the product vision and roadmap, turning an initial concept into a market-ready MVP.',
            'Led end-to-end UX, research, front-end delivery, vendors, and timelines through launch and iterative improvement.',
            'Directed cross-channel creative for digital campaigns, social media, sponsorship activations, and music-festival experiences.',
        ],
    ),
    role(
        'Senior Art Director',
        'Workday',
        'July 2012 - October 2016',
        'Led digital brand initiatives that modernized Workday\'s online presence during rapid growth leading up to its IPO.',
        [
            'Selected by the Creative Director to lead the Workday.com redesign and establish the company\'s first responsive, mobile-first web experience.',
            'Led creative direction for Workday Rising across event identity, digital experiences, microsites, and environmental design.',
            'Aligned executives, marketing teams, designers, agencies, and delivery partners around cohesive high-visibility experiences.',
            'Mentored designers while remaining hands-on in execution and quality review.',
        ],
    ),
    *section('Earlier Leadership Experience'),
    P('<b>VMware</b> - Art Director, Brand &amp; Marketing Web Design  |  2011 - 2012', small_style),
    P('<b>Salesforce</b> - Visual Designer, Dreamforce Identity &amp; Web  |  2010 - 2011', small_style),
    P('<b>Bio-Rad</b> - Interactive Designer, Data Visualization &amp; UX  |  2009 - 2010', small_style),
    P('<b>RedEnvelope</b> - Design Manager, E-commerce UX &amp; Brand  |  2005 - 2008', small_style),
    *section('Education'),
    P('<b>Juris Doctor studies</b>, Purdue Global Law School  |  In progress', small_style),
    P('<b>Master of Business Administration</b>, Purdue University Global  |  2026', small_style),
    P('<b>Bachelor of Fine Arts, Communication Design</b>, Texas State University  |  2003', small_style),
    *section('Leadership Focus'),
    P(
        'AI product and experience strategy  |  Responsible adoption  |  Design organization growth  |  '
        'Business and customer-value alignment  |  Human-centered transformation',
        small_style,
    ),
])

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
ResumeDoc(str(OUTPUT)).build(story)
print(OUTPUT)
