import React from "react";
import { Tabs, Tab, Box, Typography, Paper} from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SettingsIcon from '@mui/icons-material/Settings';
import { MdLockOutline, MdNotificationsNone, MdPalette, MdPerson } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import * as Yup from "yup";
import { 
    ICompanySettingsAPIResponseType, 
    MenuItemAppearanceType, 
    TCompanySettings,
    MenuItemAppearanceGridType 
} from "@/types/TCompanySettings";
import { Form, Formik, FormikProps } from "formik";

import "../../../sass/settings.scss"
import { disableLoading, enableLoading } from "@/reducers/appSlice";
import { Store } from "@/reducers/Store";
import SettingsAPI from "@/api/SettingsAPI";
import { showToast } from "@/helpers/Toast";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Helper component to display content for active tab
function SettingsTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`settings-tabpanel-${index}`}
        aria-labelledby={`settings-tab-${index}`}
        {...other}
        style={{ width: '100%' }}
        >
        {value === index && (
            <Box sx={{ p: { xs: 2, md: 4 } }}>
            {children}
            </Box>
        )}
        </div>
    );
}

interface IProps {
};
interface IState {
    activeTab: number;
    selectedMenuItemsGrid: MenuItemAppearanceGridType;
    selectedMenuItemsAppearance: MenuItemAppearanceType;
    currentSettings: TCompanySettings;
};

const settingsValidationSchema = Yup.object().shape({
    menuItemsAppearanceGrid: Yup.string().oneOf(['single', 'double']).default('single'),
    menuItemsAppearance: Yup.string().oneOf(['clean', 'compact']).default('clean')
})

class Settings extends React.Component<IProps, IState>
{
    private formikRef = React.createRef<FormikProps<TCompanySettings>>();
    constructor(props: IProps) {
        super(props);
        this.state = {
            activeTab: 0,
            selectedMenuItemsGrid: MenuItemAppearanceGridType.Single,
            selectedMenuItemsAppearance: MenuItemAppearanceType.Clean,
            currentSettings: {} as TCompanySettings
        }
    }

    handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        this.setState({ activeTab: newValue })
    }

    setMenuItemsSelectedLayout = (val: MenuItemAppearanceGridType) => {
        this.setState({ selectedMenuItemsGrid: val });
        this.formikRef.current!.setFieldValue('menuItemsAppearanceGrid', val);
        // If single set item to compact
        if(val == MenuItemAppearanceGridType.Double) {
            this.setState({ selectedMenuItemsAppearance: MenuItemAppearanceType.Compact });
            this.formikRef.current!.setFieldValue('menuItemsAppearance', MenuItemAppearanceType.Compact);
        }
    }

    setMenuItemsSelectedType = (val: MenuItemAppearanceType) => {
        this.setState({ selectedMenuItemsAppearance: val });
        this.formikRef.current!.setFieldValue('menuItemsAppearance', val);
        if(val == MenuItemAppearanceType.Clean) {
            // set grid to single
            this.setState({ selectedMenuItemsGrid: MenuItemAppearanceGridType.Single });
            this.formikRef.current!.setFieldValue('menuItemsAppearanceGrid', MenuItemAppearanceGridType.Single);
        }
    }

    componentDidMount(): void {
        this.fetchSettings();
    }
    
    render(): React.ReactNode {
        const currentInitialValues: TCompanySettings = {
            menuItemsAppearanceGridType: this.state.selectedMenuItemsGrid,
            menuItemsAppearance: this.state.selectedMenuItemsAppearance 
        }
        console.log(currentInitialValues);
        return (
            <div className="form-page">
                <Formik 
                        initialValues={currentInitialValues}
                        validationSchema={settingsValidationSchema}
                        onSubmit={this.onSubmit}
                        innerRef={this.formikRef}
                        validateOnMount={false}   // IMPORTANT: Don't validate on load
                        validateOnBlur={false}    // IMPORTANT: Don't validate when clicking away
                        validateOnChange={false}  // IMPORTANT: Don't validate while typing
                        enableReinitialize={true}
                    >
    
                    {({ errors, touched, setFieldValue, isSubmitting, isValid, dirty }) => (
                        <Form encType="multipart/form-data" className="modal-form-content">
                            <div className="settings-page page" key={Math.random()}>
                                <div className="main-content p-5 container">
                                    <div className="w-12 d-flex justify-content-between">
                                        <h4>Settings</h4>
                                        {/* <h3>{'Exchange <- ->'}</h3> */}
                                    </div>
                                    <Paper elevation={2} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                                        <Box
                                            sx={{
                                                flexGrow: 1,
                                                bgColor: 'background.paper',
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                minHeight: 450
                                            }}
                                        >
                                        <Tabs
                                                orientation="vertical"
                                                variant="scrollable"
                                                value={this.state.activeTab}
                                                onChange={this.handleTabChange}
                                                aria-label="App Settings Tabs"
                                                sx={{
                                                    borderRight: { md: 1 },
                                                    borderBottom: { xs: 1, md: 0 },
                                                    borderColor: 'divider',
                                                    minWidth: 220,
                                                    py: 2,
                                                    '& .MuiTab-root': {
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        textAlign: 'left',
                                                        minHeight: 48,
                                                        py: 2,
                                                        px: 3,
                                                        fontWeight: 500
                                                    },
                                                }}
                                            >
                                                <Tab icon={<MdPerson />} iconPosition="start" label="Profile" />
                                                <Tab icon={<MdNotificationsNone />} iconPosition="start" label="Notifications" />
                                                <Tab icon={<MdLockOutline />} iconPosition="start" label="Security" />
                                                <Tab icon={<MdPalette />} iconPosition="start" label="Appearance" />
                                                <Tab icon={<MdPalette />} iconPosition="start" label="Item Appearance" />
                                                <Tab icon={<MdPalette />} iconPosition="start" label="Item grid style" />
                                            </Tabs> 

                                            {/* MAIN CONTENT (RIGHT SIDE) */}
                                            <SettingsTabPanel value={this.state.activeTab} index={0}>
                                                <Typography variant="h5" gutterBottom>
                                                    Select Items & Portions
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Here goes your menu item picker and portion selector.
                                                </Typography>
                                            </SettingsTabPanel>

                                            <SettingsTabPanel value={this.state.activeTab} index={1}>
                                                <Typography variant="h5" gutterBottom>
                                                    Combo Summary
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Review your selected combo items here.
                                                </Typography>
                                            </SettingsTabPanel>

                                            <SettingsTabPanel value={this.state.activeTab} index={2}>
                                                <Typography variant="h5" gutterBottom>
                                                    Combo Settings
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Configure pricing discounts and availability rules.
                                                </Typography>
                                            </SettingsTabPanel>
                                            <SettingsTabPanel value={this.state.activeTab} index={3}>
                                                <Typography variant="h5" gutterBottom>
                                                    Appearance settings
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Select theme
                                                </Typography>
                                            </SettingsTabPanel>

                                            {/* MENUITEMS CARD STYLES */}
                                            <SettingsTabPanel value={this.state.activeTab} index={4}>
                                                <Typography variant="h5" gutterBottom>
                                                    Item Appearance
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Select menuitems appearance
                                                </Typography>
                                                <Typography color="warning">
                                                    Note: Clean way will set grid style to single column
                                                </Typography>
                                                <div className="row g-3 max-w-2xl">
                                                        {/* Option 1: Single Column Layout Card */}
                                                        <div className="col-12 col-md-6">
                                                        <div
                                                            className={`card h-100 cursor-pointer border-2 transition-all ${
                                                            this.state.selectedMenuItemsAppearance === MenuItemAppearanceType.Clean
                                                                ? 'border-primary bg-primary bg-opacity-10'
                                                                : 'border-light-subtle bg-white'
                                                            }`}
                                                            style={{ cursor: 'pointer', borderRadius: '12px' }}
                                                            onClick={() => this.setMenuItemsSelectedType(MenuItemAppearanceType.Clean)}
                                                        >
                                                            <div className="card-body p-3">
                                                            {/* Radio Header */}
                                                            <div className="form-check d-flex align-items-center gap-2 mb-3">
                                                                <input
                                                                className="form-check-input mt-0"
                                                                type="radio"
                                                                name="layoutAppearance"
                                                                id="layoutSingle"
                                                                checked={this.state.selectedMenuItemsAppearance === MenuItemAppearanceType.Clean}
                                                                onChange={() => this.setMenuItemsSelectedType(MenuItemAppearanceType.Clean)}
                                                                />
                                                                <label
                                                                className="form-check-label fw-semibold text-dark cursor-pointer"
                                                                htmlFor="layoutSingle"
                                                                >
                                                                Clean way (List)
                                                                </label>
                                                            </div>

                                                            {/* Wireframe Skeleton Preview */}
                                                            <div
                                                                className="bg-light p-3 rounded-3 border d-flex flex-column gap-2"
                                                                style={{ minHeight: '140px' }}
                                                            >
                                                                {/* Item Skeleton 1 */}
                                                                <div className="bg-white border rounded p-2 d-flex align-items-center gap-2 shadow-sm">
                                                                <div
                                                                    className="bg-secondary bg-opacity-25 rounded"
                                                                    style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                                                />
                                                                <div className="w-100">
                                                                    <div
                                                                    className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                    style={{ width: '60%', height: '8px' }}
                                                                    />
                                                                    <div
                                                                    className="bg-secondary bg-opacity-10 rounded"
                                                                    style={{ width: '35%', height: '6px' }}
                                                                    />
                                                                </div>
                                                                </div>

                                                                {/* Item Skeleton 2 */}
                                                                <div className="bg-white border rounded p-2 d-flex align-items-center gap-2 shadow-sm">
                                                                <div
                                                                    className="bg-secondary bg-opacity-25 rounded"
                                                                    style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                                                />
                                                                <div className="w-100">
                                                                    <div
                                                                    className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                    style={{ width: '70%', height: '8px' }}
                                                                    />
                                                                    <div
                                                                    className="bg-secondary bg-opacity-10 rounded"
                                                                    style={{ width: '40%', height: '6px' }}
                                                                    />
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>

                                                        {/* Option 2: Two Columns Layout Card */}
                                                        <div className="col-12 col-md-6">
                                                        <div
                                                            className={`card h-100 cursor-pointer border-2 transition-all ${
                                                            this.state.selectedMenuItemsAppearance === MenuItemAppearanceType.Compact
                                                                ? 'border-primary bg-primary bg-opacity-10'
                                                                : 'border-light-subtle bg-white'
                                                            }`}
                                                            style={{ cursor: 'pointer', borderRadius: '12px' }}
                                                            onClick={() => this.setMenuItemsSelectedType(MenuItemAppearanceType.Compact)}
                                                        >
                                                            <div className="card-body p-3">
                                                            {/* Radio Header */}
                                                            <div className="form-check d-flex align-items-center gap-2 mb-3">
                                                                <input
                                                                className="form-check-input mt-0"
                                                                type="radio"
                                                                name="layoutAppearance"
                                                                id="layoutDouble"
                                                                checked={this.state.selectedMenuItemsAppearance === MenuItemAppearanceType.Compact}
                                                                onChange={() => this.setMenuItemsSelectedType(MenuItemAppearanceType.Compact)}
                                                                />
                                                                <label
                                                                className="form-check-label fw-semibold text-dark cursor-pointer"
                                                                htmlFor="layoutDouble"
                                                                >
                                                                Compact way (Cards)
                                                                </label>
                                                            </div>

                                                            {/* Wireframe Skeleton Preview */}
                                                            <div
                                                                className="bg-light p-3 rounded-3 border"
                                                                style={{ minHeight: '140px' }}
                                                            >
                                                                <div className="row g-2">
                                                                {/* Grid Item 1 */}
                                                                <div className="col-6">
                                                                    <div className="bg-white border rounded p-2 shadow-sm">
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded w-100 mb-2"
                                                                        style={{ height: '36px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                        style={{ width: '80%', height: '7px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-10 rounded"
                                                                        style={{ width: '50%', height: '6px' }}
                                                                    />
                                                                    </div>
                                                                </div>

                                                                {/* Grid Item 2 */}
                                                                <div className="col-6">
                                                                    <div className="bg-white border rounded p-2 shadow-sm">
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded w-100 mb-2"
                                                                        style={{ height: '36px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                        style={{ width: '70%', height: '7px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-10 rounded"
                                                                        style={{ width: '45%', height: '6px' }}
                                                                    />
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                </div>
                                            </SettingsTabPanel>

                                            {/* ONE OR TWO COLUMN MENUITEMS LAYOUT */}
                                            <SettingsTabPanel value={this.state.activeTab} index={5}>
                                                <Typography variant="h5" gutterBottom>
                                                    Appearance settings
                                                </Typography>
                                                <Typography color="text.secondary">
                                                    Select items grid type
                                                </Typography>
                                                <Typography color="warning">
                                                    Note: Setting appearance to two column, will make card compact way!
                                                </Typography>
                                                <div className="row g-3 max-w-2xl">
                                                        {/* Option 1: Single Column Layout Card */}
                                                        <div className="col-12 col-md-6">
                                                        <div
                                                            className={`card h-100 cursor-pointer border-2 transition-all ${
                                                            this.state.selectedMenuItemsGrid === MenuItemAppearanceGridType.Single
                                                                ? 'border-primary bg-primary bg-opacity-10'
                                                                : 'border-light-subtle bg-white'
                                                            }`}
                                                            style={{ cursor: 'pointer', borderRadius: '12px' }}
                                                            onClick={() => this.setMenuItemsSelectedLayout(MenuItemAppearanceGridType.Single)}
                                                        >
                                                            <div className="card-body p-3">
                                                            {/* Radio Header */}
                                                            <div className="form-check d-flex align-items-center gap-2 mb-3">
                                                                <input
                                                                className="form-check-input mt-0"
                                                                type="radio"
                                                                name="layoutAppearance"
                                                                id="layoutSingle"
                                                                checked={this.state.selectedMenuItemsGrid === MenuItemAppearanceGridType.Single}
                                                                onChange={() => this.setMenuItemsSelectedLayout(MenuItemAppearanceGridType.Single)}
                                                                />
                                                                <label
                                                                className="form-check-label fw-semibold text-dark cursor-pointer"
                                                                htmlFor="layoutSingle"
                                                                >
                                                                Single Column (1 per row)
                                                                </label>
                                                            </div>

                                                            {/* Wireframe Skeleton Preview */}
                                                            <div
                                                                className="bg-light p-3 rounded-3 border d-flex flex-column gap-2"
                                                                style={{ minHeight: '140px' }}
                                                            >
                                                                {/* Item Skeleton 1 */}
                                                                <div className="bg-white border rounded p-2 d-flex align-items-center gap-2 shadow-sm">
                                                                <div
                                                                    className="bg-secondary bg-opacity-25 rounded"
                                                                    style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                                                />
                                                                <div className="w-100">
                                                                    <div
                                                                    className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                    style={{ width: '60%', height: '8px' }}
                                                                    />
                                                                    <div
                                                                    className="bg-secondary bg-opacity-10 rounded"
                                                                    style={{ width: '35%', height: '6px' }}
                                                                    />
                                                                </div>
                                                                </div>

                                                                {/* Item Skeleton 2 */}
                                                                <div className="bg-white border rounded p-2 d-flex align-items-center gap-2 shadow-sm">
                                                                <div
                                                                    className="bg-secondary bg-opacity-25 rounded"
                                                                    style={{ width: '32px', height: '32px', flexShrink: 0 }}
                                                                />
                                                                <div className="w-100">
                                                                    <div
                                                                    className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                    style={{ width: '70%', height: '8px' }}
                                                                    />
                                                                    <div
                                                                    className="bg-secondary bg-opacity-10 rounded"
                                                                    style={{ width: '40%', height: '6px' }}
                                                                    />
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>

                                                        {/* Option 2: Two Columns Layout Card */}
                                                        <div className="col-12 col-md-6">
                                                        <div
                                                            className={`card h-100 cursor-pointer border-2 transition-all ${
                                                            this.state.selectedMenuItemsGrid === MenuItemAppearanceGridType.Double
                                                                ? 'border-primary bg-primary bg-opacity-10'
                                                                : 'border-light-subtle bg-white'
                                                            }`}
                                                            style={{ cursor: 'pointer', borderRadius: '12px' }}
                                                            onClick={() => this.setMenuItemsSelectedLayout(MenuItemAppearanceGridType.Double)}
                                                        >
                                                            <div className="card-body p-3">
                                                            {/* Radio Header */}
                                                            <div className="form-check d-flex align-items-center gap-2 mb-3">
                                                                <input
                                                                className="form-check-input mt-0"
                                                                type="radio"
                                                                name="layoutAppearance"
                                                                id="layoutDouble"
                                                                checked={this.state.selectedMenuItemsGrid === MenuItemAppearanceGridType.Double}
                                                                onChange={() => this.setMenuItemsSelectedLayout(MenuItemAppearanceGridType.Double)}
                                                                />
                                                                <label
                                                                className="form-check-label fw-semibold text-dark cursor-pointer"
                                                                htmlFor="layoutDouble"
                                                                >
                                                                Two Columns (2 per row)
                                                                </label>
                                                            </div>

                                                            {/* Wireframe Skeleton Preview */}
                                                            <div
                                                                className="bg-light p-3 rounded-3 border"
                                                                style={{ minHeight: '140px' }}
                                                            >
                                                                <div className="row g-2">
                                                                {/* Grid Item 1 */}
                                                                <div className="col-6">
                                                                    <div className="bg-white border rounded p-2 shadow-sm">
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded w-100 mb-2"
                                                                        style={{ height: '36px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                        style={{ width: '80%', height: '7px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-10 rounded"
                                                                        style={{ width: '50%', height: '6px' }}
                                                                    />
                                                                    </div>
                                                                </div>

                                                                {/* Grid Item 2 */}
                                                                <div className="col-6">
                                                                    <div className="bg-white border rounded p-2 shadow-sm">
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded w-100 mb-2"
                                                                        style={{ height: '36px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-25 rounded mb-1"
                                                                        style={{ width: '70%', height: '7px' }}
                                                                    />
                                                                    <div
                                                                        className="bg-secondary bg-opacity-10 rounded"
                                                                        style={{ width: '45%', height: '6px' }}
                                                                    />
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                </div>
                                            </SettingsTabPanel>

                                        {/* FIXED STICKY FOOTER */}
                                        <div className="modal-actions-footer">
                                            <button 
                                                className="submit btn btn-primary btn-submit-save" 
                                                disabled={isSubmitting || !isValid || !dirty}
                                            >
                                                <FaSave />
                                            </button>
                                        </div>
                                        </Box>    
                                    </Paper>
                                </div>
                            </div>
                        </Form>
                    )}
                
                </Formik>
            </div>

        )
    }

    onSubmit = async(event: any) => {
        let data: TCompanySettings = {
            menuItemsAppearanceGridType: event.menuItemsAppearanceGrid || '',
            menuItemsAppearance: event.menuItemsAppearance
        }

        Store.dispatch(enableLoading({}));
        const response: ICompanySettingsAPIResponseType = await SettingsAPI.saveCompanySettings(data);
        setTimeout(() => {
            Store.dispatch(disableLoading({}));
        }, 500);

        // if modal is case
        if(response && response.success == true)  {
            const responseData = response.settings;
            showToast.success('Settings saved successfully!');
        }else {
            showToast.error('Cannot save settings!');
        }
    }

    fetchSettings = async() => {
        let response = await SettingsAPI.getSettings();
        if(response && response.success) {
            const settings = response.settings as TCompanySettings;
            this.setState({ currentSettings: settings })
            // adjustments for menuitems appearance settings
            if(settings.menuItemsAppearance) {
                this.setState({ selectedMenuItemsAppearance: settings.menuItemsAppearance });
                this.formikRef!.current?.setFieldValue("menuItemsAppearance", settings.menuItemsAppearance);
            }
            if(settings.menuItemsAppearanceGridType)
                this.setState({ selectedMenuItemsGrid: settings.menuItemsAppearanceGridType });
                this.formikRef!.current?.setFieldValue("menuItemsAppearanceGrid", settings.menuItemsAppearance);
        }
    }
}

export default Settings;