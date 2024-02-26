import {
	StringField,
	ObjectSelectionField,
	IntegerField,
	SelectField,
	StaticSelectField,
	BooleanField,
} from "./fieldTypes"
import widgetList from "./widgetList"
import { MODEL_TYPE, DataTypes, relationalFields, TYPE } from "../constants"
import { getMenuBuilderTitle } from "./properties.helper"
import { JPQLIcon } from "./label-icon"
import { JavascriptIcon } from "./label-icon"

const canCollapse = {
	name: "canCollapse",
	title: "Can Collapse",
	type: "boolean",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	isDisabled: ({ propertyList }) => {
		const widgetAttrs = propertyList?.widgetAttrs
		const isTab = widgetAttrs?.tab
		if (JSON.parse(isTab || "false")) {
			return true
		}
	},
}
const collapseIf = {
	name: "collapseIf",
	title: "Collapse If",
	type: "string",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	language: "javascript",
	icon: <JavascriptIcon />,
	tooltip:
		"The panel can be collapsed or expanded based on the evaluation of the context.",
	isDisabled: ({ propertyList }) => {
		const widgetAttrs = propertyList?.widgetAttrs
		const isTab = widgetAttrs?.tab
		if (JSON.parse(isTab || "false")) {
			return true
		}
	},
}

const isGenerateMenu = {
	name: "isGenerateMenu",
	title: "Generate menu",
	type: "boolean",
}

const isTab = {
	name: "tab",
	type: "boolean",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
}

const isSelectionField = {
	name: "isSelectionField",
	type: "boolean",
	title: "isSelectionField",
}

/** Overview Fields */
export const Name = ({ ...props } = {}) =>
	StringField({
		name: "name",
		title: "Name",
		required: true,
		readOnly: true,
		regex: /^[a-z]/i,
		regexErrorMessage: "First Letter of the name should always be alphabet",
		unique: true,
		isDisabled: (props) => {
			const { propertyList, editWidgetType, modelType, isStudioLite } = props
			if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
				return true
			}
			if (
				modelType === MODEL_TYPE.CUSTOM &&
				propertyList &&
				(propertyList.id || isStudioLite) &&
				propertyList.type === "form"
			) {
				return true
			}
			return false
		},
		requiredFor: [
			"button",
			"label",
			"panel",
			"string",
			"panel-dashlet",
			"separator",
			"panel-stack",
			"integer",
			"date",
			"time",
			"datetime",
			"decimal",
			"one-to-many",
			"many-to-many",
			"boolean",
			"label",
			"viewer",
			"editor",
			"one-to-one",
			"spacer",
			"long",
			"hilite",
		],
		...props,
	})

export const Type = StringField({
	name: "type",
	column: "type_name",
	title: "Type",
	required: true,
	selection: "json.field.type",
	readOnly: "true",
	isHidden: (props) => {
		return props.widget.isSelectionField
	},
	formatter: (value, properties) => {
		if (properties.tab) {
			return "panel-tabs"
		}
		const entityIndex = value.indexOf("entity")
		if (entityIndex !== -1) {
			return value.substring(0, entityIndex)
		}
		return value
	},
})

export const SelectableType = StaticSelectField({
	name: "type",
	title: "Type",
	column: "type_name",
	required: true,
	data: ["string", "integer"],
	defaultOption: false,
	disableClearable: true,
	isHidden: (props) => {
		return !props.widget.isSelectionField
	},
	isDisabled: (props) => {
		const { editWidgetType, modelType } = props
		if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
			return true
		}
	},
})

export const DummyType = StaticSelectField({
	name: "dummyType",
	title: "Type",
	data: [...DataTypes],
})

export const CanCollapse = BooleanField(canCollapse)

export const CollapseIf = StringField(collapseIf)

export const Title = StringField({
	name: "title",
	title: "Title",
	requiredWhen: [canCollapse, collapseIf, isTab],
	requiredFor: ["label"],
})

export const DefaultValue = StringField({
	name: "defaultValue",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Default value",
})

export const StudioApp = ObjectSelectionField({
	name: "studioApp",
	title: "App name",
	ref: "com.axelor.studio.db.StudioApp",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const Help = StringField({
	name: "help",
	title: "Help",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const Sequence = IntegerField({
	name: "sequence",
	title: "Sequence",
	dependModelType: MODEL_TYPE.CUSTOM,
})

/** Roles Fields */
export const Roles = ObjectSelectionField({
	name: "roles",
	title: " ",
	ref: "com.axelor.auth.db.Role",
	multiple: true,
	dependModelType: MODEL_TYPE.CUSTOM,
})

/** ValueExpr Fields */
export const ValueExpression = {
	name: "valueExpr",
	title: " ",
	type: "text",
	dependModelType: MODEL_TYPE.CUSTOM,
}

/** Field Options Fields */
export const Selection = SelectField({
	name: "selection",
	title: "Selection",
	ref: "com.axelor.meta.db.MetaSelect",
	valueField: "name",
	dependModelType: MODEL_TYPE.CUSTOM,
	type: "selection",
	requiredWhen: [isSelectionField],
})

export const Widget = StaticSelectField({
	name: "widget",
	data: widgetList,
	title: "Widget",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const OnChange = SelectField({
	name: "onChange",
	ref: "com.axelor.meta.db.MetaAction",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "On change",
	multiple: true,
	canAddNew: true,
	commaSeparated: true,
})

export const OnNew = SelectField({
	title: "On new",
	name: "onNew",
	ref: "com.axelor.meta.db.MetaAction",
	dependModelType: MODEL_TYPE.CUSTOM,
	multiple: true,
	commaSeparated: true,
	canAddNew: true,
})

export const OnLoad = SelectField({
	title: "On load",
	name: "onLoad",
	ref: "com.axelor.meta.db.MetaAction",
	multiple: true,
	commaSeparated: true,
	canAddNew: true,
})

export const OnSave = SelectField({
	name: "onSave",
	ref: "com.axelor.meta.db.MetaAction",
	multiple: true,
	commaSeparated: true,
	title: "On save",
	canAddNew: true,
})

export const Min = IntegerField({
	name: "minSize",
	title: "Min",
	dependModelType: MODEL_TYPE.CUSTOM,
	isHidden: (props) => {
		return props?.widget?.isSelectionField
	},
})

export const Max = IntegerField({
	name: "maxSize",
	title: "Max",
	dependModelType: MODEL_TYPE.CUSTOM,
	isHidden: (props) => {
		return props?.widget?.isSelectionField
	},
})

export const Regex = StringField({
	name: "regex",
	title: "regex",
	dependModelType: MODEL_TYPE.CUSTOM,
	isHidden: (props) => {
		return props?.widget?.isSelectionField
	},
})

export const JsonRelationalField = BooleanField({
	name: "isJsonRelationalField",
	title: "Is json relational field",
	dependModelType: MODEL_TYPE.CUSTOM,
	getValue: (properties) => {
		const type = properties["type"]
		if (type) {
			const hasJSONField = type.indexOf("json") === 0
			if (hasJSONField) {
				return true
			}
		}
		return false
	},
	change: (value, properties) => {
		const type = properties["type"]
		if (value === true) {
			const has = type.indexOf("json") === 0
			if (!has) {
				const _type = `json-${type}`
				return {
					type: _type,
					serverType: _type,
				}
			}
		} else if (value === false) {
			const has = type.indexOf("json") === 0
			if (has) {
				const _type = type.substring("json-".length)
				return {
					type: _type,
					serverType: _type,
				}
			}
		}
		return {}
	},
})

export const Domain = StringField({
	name: "domain",
	title: "Domain",
	language: "jpql",
	icon: <JPQLIcon />,
	tooltip:
		"The JPQL expression is used to filter the records displayed when opening the view. It serves as the where clause of your query.",
})

export const Prompt = StringField({
	name: "prompt",
	title: "Prompt",
	parentField: "widgetAttrs",
})

export const SelectionIn = StringField({
	name: "selection-in",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
	title: "Selection in",
})

export const Value = StringField({
	name: "value",
	title: "Value",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
})

export const ValueAdd = StringField({
	name: "value:add",
	title: "Value:add",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
})

export const ValueDel = StringField({
	name: "value:del",
	title: "Value:del",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
})

export const Refresh = BooleanField({
	name: "refresh",
	title: "Refresh",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
})

export const Active = BooleanField({
	name: "active",
	title: "Active",
	dependModelType: MODEL_TYPE.BASE,
	showInCustomField: false,
	shouldRender: (list) => {
		return list.xPath && list.xPath.includes("panel-tabs")
	},
})

export const TargetJsonModel = ObjectSelectionField({
	name: "targetJsonModel",
	required: true,
	ref: "com.axelor.meta.db.MetaJsonModel",
	displayField: "title",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Target json model",
})

export const TargetModel = SelectField({
	name: "targetModel",
	title: "Target model",
	required: true,
	ref: "com.axelor.meta.db.MetaModel",
	valueField: "fullName",
	canAddNew: false,
	isDisabled: (props) => {
		const { propertyList, editWidgetType, modelType } = props

		return (
			editWidgetType !== "customField" &&
			propertyList.serverType !== "field" &&
			modelType !== MODEL_TYPE.CUSTOM
		)
	},
})

export const GridView = SelectField({
	name: "gridView",
	title: "Grid view",
	ref: "com.axelor.meta.db.MetaView",
	valueField: "name",
	dependModelType: MODEL_TYPE.CUSTOM,
	needsTargetModel: [
		relationalFields.OneToMany,
		relationalFields.ManyToMany,
		relationalFields.ManyToOne,
	],
	isDisabled: (props) => {
		const { propertyList } = props
		return !propertyList.targetModel
	},
})

export const FormView = SelectField({
	name: "formView",
	title: "Form view",
	ref: "com.axelor.meta.db.MetaView",
	valueField: "name",
	dependModelType: MODEL_TYPE.CUSTOM,
	needsTargetModel: [
		relationalFields.OneToMany,
		relationalFields.ManyToMany,
		relationalFields.ManyToOne,
	],
	isDisabled: (props) => {
		const { propertyList } = props
		return !propertyList.targetModel
	},
})

/** Ui options fields */
export const Required = BooleanField({
	name: "required",
	title: "Required",
	defaultValue: "false",
	isDisabled: (props) => {
		const { propertyList, editWidgetType, modelType } = props
		if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
			if (propertyList["requiredIf"] && propertyList["requiredIf"].length) {
				return true
			}
		}
		return false
	},
})

export const ColumnSequence = IntegerField({
	name: "columnSequence",
	title: "Column sequence",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const ReadOnly = BooleanField({
	name: "readonly",
	title: "Readonly",
	isDisabled: (props) => {
		const { propertyList, editWidgetType, modelType } = props
		if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
			if (propertyList["readonlyIf"] && propertyList["readonlyIf"].length) {
				return true
			}
		}
		return false
	},
})

export const Hidden = BooleanField({
	name: "hidden",
	title: "Hidden",
	isDisabled: (props) => {
		const { propertyList } = props
		if (propertyList["hideIf"] && propertyList["hideIf"].length) {
			return true
		}
		return false
	},
})

export const VisibleInGrid = BooleanField({
	name: "visibleInGrid",
	title: "Visible in grid",
	dependModelType: MODEL_TYPE.CUSTOM,
})

/** Conditions Fields*/
export const ShowIf = StringField({
	name: "showIf",
	title: "Show if",
	dependModelType: MODEL_TYPE.CUSTOM,
	tooltip:
		"These conditions determine whether to show or hide the field based on the evaluation of the context.",
})

export const HideIf = StringField({
	name: "hideIf",
	title: "Hide if",
	tooltip:
		"These conditions determine whether to show or hide the field based on the evaluation of the context.",
	isDisabled: (props) => {
		const { propertyList } = props

		if (propertyList["hidden"]) {
			return true
		}
		return false
	},
})

export const If = StringField({
	name: "if",
	title: "If",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const RequiredIf = StringField({
	name: "requiredIf",
	title: "Required if",
	tooltip:
		"This condition sets the field as required or mandatory depending on the evaluation of the context.",
	isDisabled: (props) => {
		const { propertyList, editWidgetType, modelType } = props

		if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
			if (propertyList["required"]) {
				return true
			}
		}
		return false
	},
})

export const ReadOnlyIf = StringField({
	name: "readonlyIf",
	title: "Readonly if",
	tooltip:
		"This condition sets the field as read-only based on the evaluation of the context.",
	isDisabled: (props) => {
		const { propertyList, editWidgetType, modelType } = props
		if (modelType === MODEL_TYPE.BASE && editWidgetType !== "customField") {
			if (propertyList["readonly"]) {
				return true
			}
		}
		return false
	},
})

export const IncludeIf = StringField({
	name: "includeIf",
	title: "Include if",
	dependModelType: MODEL_TYPE.CUSTOM,
	tooltip:
		"The expression is evaluated to determine whether to retrieve or omit the information from the backend.",
})

export const ValidIf = StringField({
	name: "validIf",
	title: "Valid if",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	tooltip:
		"This expression evaluates the context to determine whether the value for the field is valid or not.",
})

/* TODO: Error implementation in OnlyIf is wrong,
 * currently no errors are shown, so it's fine as of now.
 */
export const OnlyIf = SelectField({
	name: "contextField",
	title: "Only if",
	ref: "com.axelor.meta.db.MetaField",
	valueField: "name",
	type: "onlyIf",
	_domain:
		"self.name not in ('createdBy', 'updatedBy') and self.relationship = 'ManyToOne' and self.metaModel.fullName = :model",
	dependModelType: MODEL_TYPE.BASE,
	showInBaseView: false,
})

export const CanSave = StringField({
	name: "canSave",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Can save",
})

export const Css = StringField({
	name: "css",
	title: "Css",
	language: "css",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
})

export const Editable = BooleanField({
	name: "editable",
	title: "Editable",
	dependModelType: MODEL_TYPE.CUSTOM,
})

/** Widget Fields*/
export const ColSpan = StaticSelectField({
	name: "colSpan",
	title: "Colspan",
	parentField: "widgetAttrs",
	data: [
		"",
		...Array(12)
			.fill()
			.map((_, i) => (i + 1).toString()),
	],
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	getOptionLabel: (option) => {
		return option ? option.toString() : ""
	},
	isDisabled: (props) => {
		const { parentPanel } = props

		if (parentPanel) {
			if ([TYPE.toolbar, TYPE.menubar].includes(parentPanel.serverType)) {
				return true
			}
		}
		return false
	},
})

export const ItemSpan = StaticSelectField({
	name: "itemSpan",
	title: "Itemspan",
	parentField: "widgetAttrs",
	data: [
		"",
		...Array(12)
			.fill()
			.map((_, i) => (i + 1).toString()),
	],
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	getOptionLabel: (option) => {
		return option ? option.toString() : ""
	},
	isDisabled: (props) => {
		const { parentPanel } = props

		if (
			parentPanel &&
			[TYPE.toolbar, TYPE.menubar].includes(parentPanel.serverType)
		) {
			return true
		}
		return false
	},
})

export const IsGenerateMenu = BooleanField(isGenerateMenu)

export const MenuBuilderTitle = StringField({
	name: "menuBuilderTitle",
	title: "Menu title",
	depends: "isGenerateMenu",
	dependValue: true,
	requiredWhen: [isGenerateMenu],
})

export const MenuBuilderParent = ObjectSelectionField({
	name: "menuBuilderParent",
	ref: "com.axelor.meta.db.MetaMenu",
	title: "Parent",
	depends: "isGenerateMenu",
	dependValue: true,
	valueField: "id",
	displayField: "title",
	shouldFetchInStart: true,
	limit: null,
	getOptionLabel: (option, data) => {
		return getMenuBuilderTitle(option, data)
	},
})

export const ShowTitle = BooleanField({
	name: "showTitle",
	parentField: "widgetAttrs",
	defaultValue: true,
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Show title",
	isDisabled: (props) => {
		const { propertyList, fieldValue } = props
		if (!fieldValue) return false
		const canCollapse = propertyList?.widgetAttrs?.canCollapse
		const collapseIf = propertyList?.widgetAttrs?.collapseIf
		return !!(canCollapse || collapseIf)
	},
	// TODO: Hide when it is property of the tab
})

export const CanSearch = BooleanField({
	name: "canSearch",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Can search",
})

export const IfModule = StringField({
	name: "if-module",
	title: "If-module",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const Height = StringField({
	name: "height",
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const Action = SelectField({
	name: "action",
	title: "Action",
	ref: "com.axelor.meta.db.MetaAction",
	requiredFor: ["panel-dashlet", "item"],
	dependModelType: MODEL_TYPE.CUSTOM,
	multiple: true,
	commaSeparated: true,
	canAddNew: true,
})

export const Field = StringField({
	name: "field",
	title: "Field",
	required: true,
	requiredFor: ["panel-related"],
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const CanMove = BooleanField({
	name: "canMove",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Can move",
})

export const OrderBy = StringField({
	name: "orderBy",
	dependModelType: MODEL_TYPE.CUSTOM,
	title: "Order by",
})

export const IncludeView = SelectField({
	name: "view",
	title: "View",
	ref: "com.axelor.meta.db.MetaView",
	valueField: "name",
	requiredFor: ["panel-include"],
	dependModelType: MODEL_TYPE.CUSTOM,
})

export const IncludeFrom = StringField({
	name: "from",
	title: "From",
})

export const Sidebar = BooleanField({
	name: "sidebar",
	title: "Sidebar",
	parentField: "widgetAttrs",
	modelType: MODEL_TYPE.CUSTOM,
	dependModelType: MODEL_TYPE.CUSTOM,
	showInCustomField: false,
	isDisabled: (props) => {
		const { hasOnlyOneNonSidebarItem, fieldValue } = props
		return hasOnlyOneNonSidebarItem && !fieldValue
	},
	isHidden: ({ parentPanel }) => {
		return parentPanel ? true : false
	},
})

export const Password = BooleanField({
	name: "password",
	title: "Password",
})

export const Model = SelectField({
	name: "model",
	title: "Model",
	required: true,
	ref: "com.axelor.meta.db.MetaModel",
	valueField: "fullName",
})

export const Color = StaticSelectField({
	name: "color",
	title: "Color",
	data: ["default", "primary", "warning", "success", "danger", "info"],
})

export const Background = StaticSelectField({
	name: "background",
	title: "Background",
	data: ["default", "primary", "warning", "success", "danger", "info"],
})

export const Strong = BooleanField({
	name: "strong",
	title: "Strong",
	dependModelType: MODEL_TYPE.BASE,
})
