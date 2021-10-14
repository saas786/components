import JetQueryDropdown from "./src/Query/Dropdown";
import JetQueryGroup from "./src/Query/Group";
import JetQueryRange from "./src/Query/Range";
import JetSelect from "./src/Inputs/Select";
import JetTable from "./src/Items/Table";
import JetGrid from "./src/Items/Grid";
import JetList from "./src/Items/List";
import JetPivotButton from "./src/Pivot/Button";
import JetPivotInput from "./src/Pivot/Input";
import JetForm from './src/Elements/Form';
import JetDetail from './src/Elements/Detail';
import JetFinder from './src/Elements/Finder';
import JetTitle from './src/Elements/Title';
import JetNotifications from './src/Elements/Notifications';
import JetPagination from './src/Elements/Pagination';
import JetTimestamp from './src/Elements/Timestamp';
import JetImageInput from './src/Inputs/Image';
import JetFileInput from './src/Inputs/File';
import JetTextarea from './src/Inputs/Textarea';

import Items from './src/Mixins/Items';
import Connect from './src/Mixins/Connect';
import Filtering from './src/Mixins/Filtering';
import ToggleFilters from './src/Mixins/ToggleFilters';
import ToggleSidebar from './src/Mixins/ToggleSidebar';
import ClickOutside from './src/Mixins/ClickOutside';
import Permissions from './src/Mixins/Permissions';

import ConnectedComponents from './src/Classses/ConnectedComponents'

import vQuery from '@jetstreamkit/v-query';

export default {

    install: (app, options) => {
        app.use(vQuery);
        app.use(ClickOutside);
        app.mixin(Permissions);
        app.provide(
            '$connectedComponents',
            new ConnectedComponents()
        );
    }

}

export {
    JetTable,
    JetGrid,
    JetList,
    JetForm,
    JetDetail,
    JetFinder,
    JetTitle,
    JetQueryDropdown,
    JetQueryGroup,
    JetQueryRange,
    JetPivotButton,
    JetPivotInput,
    JetNotifications,
    JetPagination,
    JetTimestamp,
    JetImageInput,
    JetFileInput,
    JetTextarea,
    JetSelect,
    // mixins
    ToggleFilters,
    ToggleSidebar,
    Filtering,
    Connect,
    Items,
}
