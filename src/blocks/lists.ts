// list blocks
const listBlocks: any = {
    lists_create_with: function (block: any) {
        const elements = new Array(block.itemCount_);
        for (let i = 0; i < block.itemCount_; i++) {
            elements[i] = this.valueToCode(block, 'ADD' + i, 0) || 'nobody';
        }
        return ['(list ' + elements.join(' ') + ')', 0];
    }
};

export default listBlocks;